# Archetype backbase-connectorframework-archetype

Version **5.4.1.3**

Archetype backbase-connectorframework-archetype allows you to customize Backbase Connector Framework according to your specific needs.

##Overview
We are basically creating a standard Maven WAR overlay of Backbase Connector Framework WAR. More info on how WAR overlay works you can find [here](http://maven.apache.org/plugins/maven-war-plugin/overlays.html).

The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. It also contains all necessery scripts and configuration files required for forther configuration changes. 

Backbase Connector Framework is not using database, therefore no database configurations are supplied.

The reason why you would want to create your own version of Connector Framework and therefore use this archetype is if you need to use Standalone Connector Framework and develop customizations on top of it. Most common reason for customizations is creation of custom targeting connectors and this is covered in [Developing for Targeting](https://my.backbase.com/doc-center/manuals/portal/devd_cuta.html) part of Connector Framework documentation. 

##Usage
Follow next steps to start with this archetype. Note that some of these steps refer to [Backbase Development Guide](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) or [Install Content Services](https://my.backbase.com/doc-center/manuals/portal/inst_inst_cose.html). This means that you should first familiarize yourself with these pages in general before you start using this archetype.

1. Setup Maven. For more information look at [Backbase Development Guide](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html), section 9.1, step 1. 
2. Generate project. Open a command shell and go to a location where you want to create the content services project. Execute the following command:
	<pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-contentservices-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.4.1.3
    </pre>
For more information look at [Backbase Development Guide](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html), section 9.1, step 2. 
3. As-is.
4. As-is.
5. Logback configuration is already pre-configured and configuration file for it is located within a configuration subfolder of your project root folder. 
6. Properties configuration file backbase.properties is already pre-configured and it is located in a configuration subfolder of your project root folder.
7. Environment entries are already defined within Jetty and Tomcat configuration files that are located inside the configuration/jetty and configuration/tomcat subfolders of your project root folder.
8. Not applicable.
9. Pre-configured for 1.6.
10. Not applicable.
11. Not applicable.
12. Not applicable.
13. Not applicable.

#####9.1.1 Database setup (optional)
Jetty and Tomcat files with data-source configurations are located inside configuration/jetty and configuration/tomcat folders. Everything else is as-is.

#####9.1.2 Portal Example
Not applicable.

#####9.1.3 Test

Following steps are replacing/complementing 4 steps described in this section.

1. Use the following commands instead. 

This ones prepares Content Services for running:  
    
    $ mvn clean install -P create-database

Then, if you want run Content Services on Jetty:

    $ mvn jetty:run-war

OR 

If you want to run Content Services on Tomcat 7:

    $ mvn tomcat7:run-war

Optionally run following command to delete and re-create databases when required:

    $ mvn clean -P clean-database

Both Jetty and Tomcat use 8080 ports.

2. As-is.
3. As-is.
4. As-is.

####9.2 Targeting
Not applicable.

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
------myjob.properties --> example scheduler job configuration  
--**jetty**  
---jetty.xml --> jetty JNDI bindings for portal web application defined with this Maven project  
---webdefaults.xml --> jetty configuration  
--**scripts**  
---**contentservices** --> content services database scripts for all databases we support    
--**tomcat**  
---context.xml --> tomcat 7 JNDI bindings for portal web application defined with this Maven project   
---server.xml --> tomcat 7 server configuration  
--backbase.properties --> main backbase configuration file   
--logback.xml --> logback configuration file   
-**data** --> working folder for local storage, such as H2 database files, orchestrator and import/export work packages and so on  
-**src**  
--**main**  
---**java**
---**resources**   
----**META-INF**  
-----**meta-model** --> folder where custom CMIS models would go   
-----**spring** --> folder where custom spring configurations would go    
---**webapp**    
--**test**  
---**java**   
----**com**  
-----**backbase**  
------**test**
-------**contentservices**  
--------InstallationValidationTestST.java --> Test used to validate build on embedded server  
---**resources**  
-pom.xml  
