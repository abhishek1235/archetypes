# RELEASE NOTES

| Date                  | MM dd, YYYY 
| Issues                | x issues

Release of sprint 5.5.0.0-SNAPSHOT.

    │<PACKAGE>
    ├── configuration
    │   └── i18n
    │       ├── ResourceBundle.properties
    │       └── ResourceBundle_ar_AA.properties    
    │   ├── backbase.properties
    │   ├── deviceConfig.xml
    │   ├── esapi.properties
    │   ├── ice-config.properties
    │   ├── logback.xml
    │   ├── ptc-config.properties
    │   ├── ptc-config.xml
    │   ├── services.properties
    │   └── to-self-publishchains.xml
    ├── release-notes
    │   └── TODO
    ├── statics
    │   ├── gulfbank-desktop-theme.zip
    │   ├── gulfbank-mobile-theme.zip
    │   ├── olb-bundle.zip
    │   └── olb-change-info.zip          
    ├── wars
    |   ├── contentservices.war
    |   ├── orchestrator.war
    |   └── portalserver.war
    └── exports
        ├── desktop-portal.zip
        └── mobile-portal.zip

1. Stop application server
2. Remove portalserver.war
3. Copy the new portalserver.war from /wars to the application server
4. Start application server
5. Log in to Portal Manager at "PORTAL_CONTEXT/portals/dashboard".
6. Select the 'Import Portal' option and load the portal-export.zip file.
