# Archetype backbase-es-project-archetype

Version **5.5.0.0**

##Overview
A blank Maven archetype for the standard enterprise project setup with full suite of Backbase CXP components.

This archetype facilitates standard project setup as Backbase Expert Services do it. The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. 

H2 is the default database. Refer to the reference documentation for full details on how to [move to a database of your choice if required](https://my.backbase.com/resources/documentation/portal/inst_data.html).

Mashup Services are pre-configured together with example RSS pipe.

Targeting is pre-configured together with example WeatherCollector.

Content Services are pre-configured and ready to use from within Portal Manager.

Publishing is pre-configured for self-publishing. Refer to our reference documentation for more information on [Configure Publishing](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#N632EA) how to configure publishing by modifying the orchestrator configuration file which is located inside the configuration folder.

Launchpad Foundation is pre-configured and ready to be customized. Launchpad Foundation consists of Launchpad Theme, Launchpad Templates, Launchpad Foundation Containers and Launchpad Foundation Widgets.

##Usage
Follow the steps below to get started with this archetype. Some of these steps refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) or [Install Portal Foundation](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_pofo). You should get familiar with these topics before you start using this archetype.

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
2. Generate the project. Open a command shell and go to a location where you want to create the content services project. Execute the following command:
    <pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-es-project-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.5.0.0
    </pre>
Refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) for more information.  
3. Optionally adjust JMV properties, differently configure the logback, or make some changes to main configuration file (backbase.properties). For any of these steps refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) or [Install Portal Foundation](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_pofo).
4. Use the following command from the root project folder to prepare the project for running:
    <pre>
    $ mvn clean install -P create-database
    </pre>
If you want to run Launchpad Theme on Jetty, move to theme sub-folder and run this:  
    <pre>
    $ mvn jetty:run-war
    </pre>
Or, if you want to run Launchpad Theme on Tomcat 7:
    <pre>
    $ mvn tomcat7:run-war
    </pre>
If you want to run Portal on Jetty, move to portalserver sub-folder and run this:  
    <pre>
    $ mvn jetty:run-war
    </pre>
Or, if you want to run Portal on Tomcat 7:
    <pre>
    $ mvn tomcat7:run-war
    </pre>
Optionally run following command from the root project folder to delete and re-create databases when required:
    <pre>
    $ mvn clean -P clean-database
    </pre>
Note that by default both Jetty and Tomcat for Portal Foundation and Launchpad Theme use the 7777, for Content Services they use 8081 and for Orchestrator they use 8083. In case you need to choose a different ports since you maybe already have another process running on some of these ports, make necessary changes in Jetty and Tomcat plugins within respective POM files before you run any of these components (Portal Foundation, Content Services or Orchestrator).
5. Test Portal Foundation by opening the Portal Foundation URL in a browser: [http://localhost:7777/portalserver/](http://localhost:7777/portalserver/) (pay attention to the port number).
6. Test Launchpad Theme by opening the main theme CSS in a browser: [http://localhost:7777/portalserver/static/themes/default/base.less](http://localhost:7777/portalserver/static/themes/default/base.less) (pay attention to the port number).
7. Test embedded Mashup Services by opening the Mashup Services RSS pipe URL in a browser: [http://localhost:7777/portalserver/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/](http://localhost:7777/portalserver/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/) (pay attention to the port number). Existing RSS pipe fetches RSS feed from url parameter and then applies XSLT transformation to create a snippet of HTML that can be used from some widget for example.
8. Test Content Services by opening the Content Services RSS URL in a browser: [http://localhost:8081/portalserver/content/atom](http://localhost:8081/portalserver/content/atom) (pay attention to the port number) or by using some CMIS client software. More info on how to use [CMIS Workbench](https://my.backbase.com/doc-center/manuals/portal/cont_cont.html#cont_cont_cmis) can be found on the CMIS Workbench page of our documentation.
9. Test Orchestrators by opening the Orchestrator configuration URL in a browser: [http://localhost:8083/portalserver/orchestrator/configuration](http://localhost:8083/portalserver/orchestrator/configuration) (pay attention to the port number).

##Anatomy
TODO
