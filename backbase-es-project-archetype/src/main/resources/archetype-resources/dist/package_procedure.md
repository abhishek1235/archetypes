# Packaging procedure

1. mvn release:prepare

2. mvn release:perform

3. svn co the newly create tag created in step 4

4. execute releaseNotes.sh on the newly create tag and add them to the release notes.

5. Create package

  mvn clean

  mvn install -DskipTests=true -P portal,full,with-dashboard,with-backbase-bundle,backbase,production
  
6. Export model/content via REST API
  
Basic auth: admin/admin

    POST http://<HOST>:<PORT>/portal/orchestrator/export/exportrequests

Body:

    <exportRequest>
        <portalExportRequest>
            <portalName>hiscox</portalName>
            <includeContent>true</includeContent>
            <includeGroups>true</includeGroups>
        </portalExportRequest>
    </exportRequest>
      
      
7. Import model/content via REST API
      
      ??



