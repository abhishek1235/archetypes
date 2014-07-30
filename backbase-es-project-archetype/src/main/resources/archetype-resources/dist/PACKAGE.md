# RELEASE NOTES

| Date                  | May 28, 2014 
| Issues                | x issues


##Summary

Release of sprint ${version}.

## Package contents

    │<PACKAGE>
    ├── configuration
    │   ├── backbase.properties
    │   ├── esapi.properties
    │   ├── ice-config.properties
    │   ├── logback.xml
    │   ├── ptc-config.properties
    │   ├── services.properties
    │   └── to-self-publishchains.xml
    ├── release-notes
    │   ├── release-${version}.txt
    ├── statics
    │   ├── backbase.bundle.zip
    └── wars
        ├── contentservices.war
        ├── forms-runtime.war
        ├── orchestrator.war
        └── portal.war
    
## Changes

### Files Added in the release
    
    svn diff https://svn.backbase.com/customers/${project.name}/tags/web-parent-${version} --summarize -r {2014-05-08}:{2014-05-28} | grep ^A > log_added.txt
    
### Files Removed in the release

    svn diff https://svn.backbase.com/customers/${project.name}/tags/web-parent-${version} --summarize -r {2014-05-08}:{2014-05-28} | grep ^D > log_removed.txt    

### Files Updated in the release

    svn diff https://svn.backbase.com/customers/${project.name}/tags/web-parent-${version} --summarize -r {2014-05-08}:{2014-05-28} | grep ^M > log_updated.txt
    
    # Remove 'M     ' from the log_updated.txt file and output it to log_updated_fixed.txt
    sed 's/ //g' log_updated.txt | sed 's/^M//g' >  log_updated_fixed.txt
    
Then for each file call:

    cat log_updated_fixed.txt | while read line ; do svn diff $line -r {2014-05-08}:{2014-05-28} | grep ^+ ; done > log_updated_config_details.txt
    
    #Cleanup files 
    sed 's/https:\/\/svn.backbase.com\/customers\/${project.name}\/tags\/web-parent-${version}//g' log_added.txt > log_added_clean.txt
    
### Files Updated configuration files in the release

    Update configuartion
    svn diff https://svn.backbase.com/customers/${project.name}/tags/web-parent-${version} --summarize -r {2014-05-08}:{2014-05-28} | grep ^A | grep /web-parent-${version}/configuration > log_added_config.txt
    svn diff https://svn.backbase.com/customers/${project.name}/tags/web-parent-${version} --summarize -r {2014-05-08}:{2014-05-28} | grep ^M | grep /web-parent-${version}/configuration  > log_updated_config.txt    

## How to upgrade

### Portal
1. Stop application server
2. Remove portal.war
3. Copy the new portal.war from /wars to the application server
4. Start application server
5. Log in to Portal Manager at "PORTAL_CONTEXT/portals/dashboard".
6. Select the 'Import Portal' option and load the portal-export.zip file.

### Statics
1. Remove all /portal/statics/* files from the web server
2. unzip backbase.bundle.zip
4. Copy all files to /portal/statics/* on the web server

### Properties
1. Make sure all applications are stopped.
2. View the release notes
3. Apply the changes to the property files
