#!/bin/sh

FROM=$1
UNTIL=$2
TAG=$3

echo "Create release notes for ${project.name}. Date format should be '2014-05-28'. 'Tag format should be web-parent-0.9'"

if [ -z $FROM ]; then
	echo "From is not filled"
	exit 0
fi

if [ -z $UNTIL ]; then
	echo "Until is not filled"
	exit 0
fi

if [ -z $TAG ]; then
	echo "Tag is not filled"
	exit 0
fi

echo "From=$FROM"
echo "Until=$UNTIL"
echo "Tag=$TAG"

rm -rf logs
mkdir logs

echo "Create log_added"
svn diff https://svn.backbase.com/customers/${project.name}/tags/$TAG --summarize -r {$FROM}:{$UNTIL} | grep ^A > logs/log_added.txt

echo "Create log_removed"
svn diff https://svn.backbase.com/customers/${project.name}/tags/$TAG --summarize -r {$FROM}:{$UNTIL} | grep ^D > logs/log_removed.txt

echo "Create log_updated"
svn diff https://svn.backbase.com/customers/${project.name}/tags/$TAG --summarize -r {$FROM}:{$UNTIL} | grep ^M > logs/log_updated.txt

# Update configuration and 'grep' the configuration folder
echo "Log details about the configuration changes"
cat logs/log_added.txt | grep ^A | grep /$TAG/configuration > logs/log_added_config.txt
cat logs/log_updated.txt | grep ^M | grep /$TAG/configuration  > logs/log_updated_config.txt

# Remove 'M     ' from the log_updated.txt file and output it to log_updated_fixed.txt
echo "Fix log_updated.txt and output to log_updated_fixed.txt"
sed 's/ //g' logs/log_updated_config.txt | sed 's/^M//g' >  logs/log_updated_config_fixed.txt

#Then for each line call:
echo "Create details for every entry in log_updated_fixed.txt"
cat logs/log_updated_config_fixed.txt | while read line ; do svn diff $line -r {$FROM}:{$UNTIL} | grep ^+ ; done > logs/log_updated_config_details.txt

echo "Remove tmp file log_updated_config_fixed"
rm logs/log_updated_config_fixed.txt

## Cleanup files doesn't work, the $TAG in the sed command does not get replace
#sed 's/https:\/\/svn.backbase.com\/customers\/${project.name}\/tags\/$TAG//g' logs/log_updated.txt > logs/log_updated_clean.txt
    

