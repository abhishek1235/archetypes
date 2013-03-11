# Archetype backbase-portal-archetype-all-in-one

##Overview
A blank Maven archetype for the Backbase Portal server running on a single JVM instance. This archetype contains integrated Mashup Services, Content Services and Orchestrator with necessery configuration files already pre-configured.

This archetype enables all-in-one setup for local development. Focus of this archetype is on demonstartion of how to configure Content Services and Orchestrator to run along Backbase Portal on same JVM process of server of your choice. Currently in Maven we have pre-configured Jetty and Tomcat 7. One can easily swicth from tomcat 7 to Tomcat 6 in single line within POM file. 

Default database stays H2 and basic developemnt guide already instructs on how to move to a database of your choice if required.

Content Services are pre-configured and ready to use frokm within Portal Manager.

Orchestrator is pre-configured for self-publishing. More info within orchestrator configuration file which is located inside configuration folder.

Targeting is pre-configured together with example WeatherCollector.

##Usage
Usage is almost the same as already explained for default archetype in [Backbase Development Guide](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html). 

In next few lines we are giving modifications to a previously referenced page from this manual

###9 Development Setup

Following steps are replacing/complementing 13 steps described in Development Setup Procedure.

####9.1 Backbase Portal Foundation

1. As-is.
2. All is the same except that we ned to use this archetype, so Maven command would look like this:  
    <pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=archetype-name
        -DarchetypeGroupId=com.backbase.expert.tools.archetypes
        -DarchetypeVersion=archetype-version
    </pre>
3. As-is.
4. As-is.
5. Logback configuration is already pre-configured and configuration file for it is located within a configuration subfolder of your project root folder.
6. Properties configuration file backbase.properties is already pre-configured and it is located in a configuration subfolder of your project root folder.
7. Environment entries are already defined within Jetty and Tomcat configuration files that are located inside the configuration/jetty and configuration/tomcat subfolders of your project root folder.
8. Done inside a properties configuration file backbase.properties as part of step #6.
9. Pre-configured for 1.6.
10. Pre-configured.
11. Done.
12. As-is.
13. As-is.

#####9.1.1 Database setup (optional)
Jetty and Tomcat files with data-source configurations are located inside configuration/jetty and configuration/tomcat folders. Everything else is as-is.

#####9.1.2 Portal Example
As-is.

#####9.1.3 Test

Following steps are replacing/complementing 4 steps described in this section.

1. Use the following commands instead. 

This ones prepares Portal for running:  
    
    $ mvn clean install -P create-database

Then, if you want run Portal on Jetty:

    $ mvn jetty:run-war

OR 

If you want to run Portal on Tomcat 7:

    $ mvn tomcat7:run-war

Optionally run following command to delete and re-create databases when required:

    $ mvn clean -P clean-database

Both Jetty and Tomcat use 8080 ports.

2. As-is.
3. As-is.
4. As-is.

####9.2 Targeting
As-is.

####9.3 Maven Settings File
As-is.

##Anatomy
**project**  
-**configuration**  
--**contentservices** --> optional example files that can be used with Content Services  
---**contentRepository**  
----**importers**  
-----**cmis**  
------alfresco.properties --> example CMIS importer configuration  
-----**feed**  
------BloombergBlog.properties --> example RSS importer configuration  
----**scheduler**  
-----**job**  
------myjob.properties --> example schedule rjob configuration  
--**jetty**  
---**contentservices**  
----jetty-web.xml --> jetty JNDI bindings for contentservices web application  
---**orchestrator**  
----jetty-web.xml --> jetty JNDI bindings for orchestrator web application  
---jetty.xml --> jetty JNDI bindings for portal web application defined with this Maven project  
---webdefaults.xml --> jetty configuration  
--**scripts**  
---**contentservices** --> content services database scripts for all databases we support  
---**foundation** --> portal foundation database scripts for all databases we support  
---**orchestrator** --> orchestrator database scripts for all databases we support  
--**tomcat**  
---context.xml --> tomcat 7 context configuration  
---server.xml --> tomcat 7 server configuration  
--backbase.properties --> main backbase configuration file  
--ice-config.properties --> backbase ICE configuration file  
--logback.xml --> logback configuration file  
--orchestrator-config.xml --> orchestrator configuration file  
-**data** --> working folder for local storage, such as H2 database files, orchestrator and import/export work packages and so on  
-**src**  
--**main**  
---**coreResources**  
----**import**  
-----importPortal.xml --> backbase portal import file for portal without portal manager  
---**dashboardResources**  
----**import**  
-----importPortal.xml --> backbase portal import file for portal with portal manager  
---**java**
----**com**
-----**backbase**
------**targeting**
-------**collector**
--------**examples**
---------WeatherContextCollector.java --> target collector example
----**my**
-----**company**
------**com** --> empty Java package created based on package name for project
---**resources**  
----**import**  
-----importPortal.xml --> copy of one from dashboardResources/import  
----**META-INF**  
-----**spring**  
------**optional**  
-------targeting-connectorframework.xml --> spring configuration for targeting that refers to targetimng example 
------backbase-portal-application-config.xml --> spring configuration suitable to hook custom spring configurations  
------backbase-portal-integration-config.xml --> spring configuration suitable to hook custom spring configurations  
---**webapp**  
----**static**  
-----**default**  
------**css**  
-------backbaseportalserver.css  
------**media**  
-------BB_logo_.png  
-------bb_ribbon.png  
-------bg_pm.png  
-----**lib**  
------jquery-1.6.1-min.js  
----**WEB-INF**  
-----**default** --> default backbase templates  
------borderlayout.jsp  
------container.jsp  
------link.jsp  
------page.jsp  
------widget.jsp  
-----**import**  
------chooseImport.jsp --> import portal page  
-----ehcache_statistics.jsp --> eh cache statistics page  
-----hibernate_statistics.jsp --> hibernate statistics page  
-----ibm-web-ext.xmi --> IBM WAS specific configuration file  
-----index.jsp  
-----jboss-deployment-structure.xml --> JBoss deployment specific configuration file  
-----jboss-web.xml--> JBoss specific configuration file  
-----portal.tld --> portal's TLD  
-----web.xml  
--**test**  
---**java**   
----**my**  
-----**company**  
------**portalserver**  
-------InstallationValidationTestST.java --> Test used to validate build on embedded server  
---**resources**  
-pom.xml  
