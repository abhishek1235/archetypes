# Archetype backbase-orchestrator-archetype

Version **5.5.0.0**

##Overview
This archetype allows you to customize Backbase Orchestrator according to your specific needs. We are basically creating a standard Maven WAR overlay of Standalone Backbase Orchestrator WAR. More info on how WAR overlay works you can find [here](http://maven.apache.org/plugins/maven-war-plugin/overlays.html).

The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. It also contains all necessery scripts and configuration files required for forther configuration changes. 

H2 is the default database. Refer to the reference documentation for full details on how to [move to a database of your choice if required](https://my.backbase.com/resources/documentation/portal/inst_data.html).

The reason why you would want to create your own version of Orchestrator and therefore use this archetype is if you need to customize Orchestrator according to your special needs or just run it locally. The most common reason for modifications is the creation of custom publishing event processors and ability to run it locally.

##Usage
Follow the steps below to get started with this archetype. Some of these steps refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) or [Install Publishing](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_orch). You should get familiar with these topics before you start using this archetype.

1. Configure your Maven installation to include the Backbase extensions repository by editing the settings.xml file located in the .m2 folder. 
    <pre>```    
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <profiles>
            <profile>
                <id>backbase</id>
                <activation>
                    <activeByDefault>true</activeByDefault>
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
2. Generate the project. Open a command shell and go to a location where you want to create the orchestrator project. Execute the following command:
    <pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-orchestrator-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.5.0.0
    </pre>
Refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) for more information. 
3. Optionally adjust JMV properties, differently configure the Logback, or make some changes to main configuration file (backbase.properties). For any of these steps refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) or [Install Publishing](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_orch).
4. Use the following command to prepare the project for running.
    <pre>
    $ mvn clean package -P create-database
    </pre>
If you want to run Orchestrator on Jetty:  
    <pre>
    $ mvn jetty:run
    </pre>
Or, if you want to run Orchestrator on Tomcat 7:
    <pre>
    $ mvn tomcat7:run
    </pre>
Optionally run following command to delete and re-create database when required:
    <pre>
    $ mvn clean -P clean-database
    </pre>
Note that both Jetty and Tomcat use the 8083 port by default. In case you need to choose a different port since you maybe already have another process running on port 8083, make necessary changes in jetty and tomcat plugins within POM file before you run Orchestrator.
5. Test Orchestrator by opening the Orchestrator configuration URL in a browser: [http://localhost:8083/orchestrator-webapp/configuration](http://localhost:8083/orchestrator-webapp/configuration) (pay attention to the port number). Use admin/admin to authenticate.
6. In order to integrate Orchestrator with your Portal Foundation that is running in its own standalone process, make sure to configure Portal Foundation’s Orchestrator Proxy within backbase.properties as it is explained in [Proxy Configuration](https://my.backbase.com/resources/documentation/portal/inst_conf.html#inst_conf_prox).

##Anatomy
**project**  
-**configuration**  
--**jetty**  
---jetty.xml --> Jetty JNDI bindings for Orchestrator web application defined with this Maven project  
---webdefaults.xml --> Main Jetty configuration  
--**scripts**  
---**orchestrator** --> Orchestrator database scripts for all databases we support  
--**tomcat**  
---context.xml --> Tomcat 7 JNDI bindings for Orchestrator web application defined with this Maven project  
---server.xml --> Tomcat 7 server configuration  
--backbase.properties --> Main Backbase configuration file  
--logback.xml --> Logback configuration file  
--to-self-publishchains.xml --> Publishing configuration file  
-**data** --> Folder where all local data is stored  
-**src**  
--**main**  
---**java**  
---**resources**  
----**META-INFO**  
-----ehcache-orchestrator.xml --> Ehcache Orchestrator configurations  
----ehcache-orchestrator.xml --> Ehcache Orchestrator configurations  
---**webapp**  
----**static**  
----version.txt --> Build version info file  
--**test**  
---**java**  
----**com**  
-----**backbase**  
------**test**  
-------**orchestrator**  
--------InstallationValidationTestST.java --> Test used to validate Orchestrator on embedded server  
---**resources**  
-build.bat  
-build.sh  
-initial_build.bat  
-initial_build.sh  
-pom.xml  
-start.bat  
-start.sh  
