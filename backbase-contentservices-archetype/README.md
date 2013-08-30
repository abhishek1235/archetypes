# Archetype backbase-contentservices-archetype

Version **5.4.1.3**

##Overview
This archetype allows you to customize Backbase Content Services according to your specific needs. We are basically creating a standard Maven WAR overlay of Standalone Backbase Content Services WAR. More info on how WAR overlay works you can find [here](http://maven.apache.org/plugins/maven-war-plugin/overlays.html).

The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. It also contains all necessery scripts and configuration files required for forther configuration changes. 

H2 is the default database. Refer to the reference documentation for full details on how to [move to a database of your choice if required](https://my.backbase.com/doc-center/manuals/portal/inst_inst_cose.html#inst_inst_cs_database).

The reason why you would want to create your own version of Content Services and therefore use this archetype is if you really need to customize Content Services according to your special needs. The most common reason for modifications is the creation of custom CMIS content types and this is covered in one of the [Backbase Dev Guides](https://my.backbase.com/doc-center/dev-guides/adding-a-custom-data-type-in-content-services/). Other reasons may include the creation of custom content importers, validators, or renditions, or eventually some different configurations that are not initially exposed in external configuration files. 

##Usage
Follow the steps below to get started with this archetype. Some of these steps refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) or [Install Content Services](https://my.backbase.com/doc-center/manuals/portal/inst_inst_cose.html). You should get familiar with these topics before you start using this archetype.

1. Configure your Maven installation to include the Backbase extensions repository by editing the settings.xml file located in the .m2 folder. 
    <pre>```    
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <profiles>
            <profile>
                <id>backbase</id>
                <activation>
                    <activebydefault>true</activebydefault>
                </activation>
                <repositories>
                    <repository>
                        <id>Backbase Artifact Repository</id>
                        <url>https://repo.backbase.com/repo/</url>
                    </repository>
                    <repository>
                        <id>Backbase Extensions Repository</id>
                        <url>https://repo.backbase.com/extensions/</url>
                    </repository>
                </repositories>
            </profile>
        </profiles>
        <servers>
            <server>
                <id>Backbase Artifact Repository</id>
                <!--Please change your_user_name and your_password below-->
                <username>your_user_name</username>
                <password>your_password</password>
            </server>
            <server>
                <id>Backbase Extensions Repository</id>
                <!--Please change your_user_name and your_password below-->
                <username>your_user_name</username>
                <password>your_password</password>
            </server>
        </servers>
    </settings>
    ```</pre>
2. Generate the project. Open a command shell and go to a location where you want to create the content services project. Execute the following command:
    <pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-contentservices-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.4.1.3
    </pre>
Refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) for more information. 
3. Optionally adjust JMV properties, differently configure the logback, or make some changes to main configuration file (backbase.properties). For any of these steps refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) or [Install Content Services](https://my.backbase.com/doc-center/manuals/portal/inst_inst_cose.html).
4. Use the following command to prepare the project for running.
    <pre>
    $ mvn clean install -P create-database
    </pre>
If you want to run Mashup Services on Jetty:  
    <pre>
    $ mvn jetty:run-war
    </pre>
Or, if you want to run Mashup Services on Tomcat 7:
    <pre>
    $ mvn tomcat7:run-war
    </pre>
Optionally run following command to delete and re-create databases when required:
    <pre>
    $ mvn clean -P clean-database
    </pre>
Note that both Jetty and Tomcat use the 8081 port by default. In case you need to choose a different port since you maybe already have another process runing on port 8081, make necessary changes in jetty and tomcat plugins within POM file before you run Content Services.
5. Test Content Services by opening the Content Services RSS URL in a browser: http://localhost:8081/contentservices-webapp/ (pay attention to the port number) or by using some CMIS client software. More info on how to use [CMIS Workbench](https://my.backbase.com/doc-center/manuals/portal/cont_cont.html#cont_cont_cmis) can be found on the CMIS Workbench page of our documentation.
6. In order to integrate Content Services with your Backbase Portal that is running in its own standalone process, make sure to configure Portal’s Content Services Proxy within backbase.properties as it is explained in [Proxy Configuration](https://my.backbase.com/doc-center/manuals/portal/inst_inst_configfiles.html#inst_inst_proxyconfig).

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
---jetty.xml --> jetty JNDI bindings for portal web application defined with this Maven project  
---webdefaults.xml --> jetty configuration  
--**scripts**  
---**contentservices** --> content services database scripts for all databases we support  
--**tomcat**  
---context.xml --> tomcat 7 JNDI bindings for portal web application defined with this Maven project   
---server.xml --> tomcat 7 server configuration  
--backbase.properties --> main backbase configuration file    
--logback.xml --> logback configuration file   
-**src**  
--**main**  
---**java**  
---**resources**     
----**META-INF**  
-----**meta-model**  
-----**spring**  
--**test**  
---**java**   
----**com**  
-----**backbase**  
------**test**  
-------**contentservices**  
--------InstallationValidationTestST.java --> Test used to validate Content Services on embedded server  
---**resources**  
-pom.xml  
