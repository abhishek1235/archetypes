#!/bin/bash

#
# Usage: start.sh [-b]
#

BASE_PATH=$(pwd)
LOG_PATH=$BASE_PATH

# run paths.
CONTENT_SERVICES_PATH="contentservices"
PORTAL_SERVER_PATH="portal"
ORCHESTRATOR_PATH="orchestrator"
THEME_PATH="statics/themes"

# run commands.
CONTENT_SERVICES_RUN="sh start.sh"
PORTAL_SERVER_RUN="sh start.sh"
ORCHESTRATOR_RUN="sh start.sh"
THEME_BUILD="mvn install"

# check run in bg.
RUN_IN_BG=true
if [ ! -z `which osascript` ]; then
	RUN_IN_BG=false
fi
while getopts "b" opt; do
    case $opt in
        b)
            RUN_IN_BG=true
            ;;
    esac
done

function run_in_tab() {
	NAME=$1; shift
	RUN_PATH=$1; shift
	RUN_CMD=$1; shift

	COMMAND="cd ${BASE_PATH}/${RUN_PATH} && $RUN_CMD"
	osascript \
		-e "tell application \"Terminal\"" \
		-e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
		-e "do script \"printf '\\\e]1;$NAME\\\a'; $COMMAND\" in front window" \
		-e "end tell" > /dev/null
}

function run_in_bg() {
	NAME=$1; shift
	RUN_PATH=$1; shift
	RUN_CMD=$1; shift
	# to kill: "pkill -f jetty"
	( cd ${BASE_PATH}/${RUN_PATH} && $RUN_CMD &> ${LOG_PATH}/${RUN_PATH}/run.log & )
}

function run_server() {
	if [ "$RUN_IN_BG" = true ]; then
		run_cmd="run_in_bg"
		echo "Starting $1 in background (run 'pkill -f jetty to' stop)"
	else
		run_cmd="run_in_tab"
	fi
	$run_cmd "$@"
}

function build_theme() {
	echo "Building theme"
	( cd ${BASE_PATH}/${THEME_PATH} && $THEME_BUILD ) 2>&1 > /dev/null
	echo "... done"
}

function main() {
	run_server "Content Services" "$CONTENT_SERVICES_PATH" "$CONTENT_SERVICES_RUN"
	run_server "Portal Server" "$PORTAL_SERVER_PATH" "$PORTAL_SERVER_RUN"
	run_server "Orchestrator" "$ORCHESTRATOR_PATH" "$ORCHESTRATOR_RUN"
	build_theme
}

# run the servers
main
