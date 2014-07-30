#!/bin/bash

BASE_DIR=$(pwd)

function new_tab() {
  TAB_NAME=$1
  COMMAND=$2
  osascript \
    -e "tell application \"Terminal\"" \
    -e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
    -e "do script \"printf '\\\e]1;$TAB_NAME\\\a'; $COMMAND\" in front window" \
    -e "end tell" > /dev/null
}

# content services
new_tab "Content Services" "cd $BASE_DIR/contentservices; chmod +x start.sh; ./start.sh"

# portalserver
new_tab "Portal Server" "cd $BASE_DIR/portal; chmod +x start.sh; ./start.sh"

# theme
new_tab "Orchestrator" "cd $BASE_DIR/orchestrator; chmod +x start.sh; ./start.sh"