# Archetype backbase-portal-archetype-all-in-one-launchpad

Version **5.4.1.3**

##Overview
A blank Maven archetype for the Backbase Portal Foundation with all other Backbase modules embedded together with Launchpad Foundation running on a single JVM instance. This archetype contains integrated Mashup Services, Targeting, Content Services, Orchestrator and Launchpad Foundation with all necessery configuration files already pre-configured.

This archetype enables all-in-one setup for local development. Focus of this archetype is on demonstration of how to configure Content Services, Orchestrator and Launchpad Foundation to run along Backbase Portal Foundation on same JVM process of server of your choice.

The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. It also contains all necessery scripts and configuration files required for forther configuration changes.

H2 is the default database. Refer to the reference documentation for full details on how to [move to a database of your choice if required](https://my.backbase.com/doc-center/manuals/portal/inst_inst_cose.html#inst_inst_cs_database).

Mahup Services are pre-configured together with example RSS pipe.

Targeting is pre-configured together with example WeatherCollector.

Content Services are pre-configured and ready to use frokm within Portal Manager.

Orchestrator is pre-configured for self-publishing. More info within orchestrator configuration file which is located inside configuration folder.

Launchpad Foundation is pre-configured and ready to be customized. Launchpad Foundation consists of Launchpad Theme, Launchpad Templates, Launchpad Foundation Containers and Launchoad Foundation Widgets.

##Usage
Follow the steps below to get started with this archetype. Some of these steps refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) or [Install Portal Foundation](https://my.backbase.com/doc-center/manuals/portal/inst_pofo.html). You should get familiar with these topics before you start using this archetype.

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
        -DarchetypeArtifactId=backbase-portal-archetype-all-in-one-launchpad
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.4.1.3
    </pre>
Refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) for more information. 
3. Optionally adjust JMV properties, differently configure the logback, or make some changes to main configuration file (backbase.properties). For any of these steps refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) or [Install Portal Foundation](https://my.backbase.com/doc-center/manuals/portal/inst_pofo.html).
4. Use the following command from the root project folder to prepare the project for running.
    <pre>
    $ mvn clean install -P create-database
    </pre>
If you want to run Launchpad Theme on Jetty, move to theme folder and run this:  
    <pre>
    $ mvn jetty:run-war
    </pre>
Or, if you want to run Launchpad Theme on Tomcat 7:
    <pre>
    $ mvn tomcat7:run-war
    </pre>
If you want to run Portal on Jetty, move to portalserver folder and run this:  
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
Note that both Jetty and Tomcat for Portal use the 8080 port by default, while the Launchpad Theme is running on port 8085. In case you need to choose a different port since you maybe already have another process runing on ports 8080 and 8085, make necessary changes in jetty and tomcat plugins within POM files before you run Portal and Launchpad Theme.
5. Test Portal by opening the Portal Foundation URL in a browser: http://localhost:8080/portalserver/ (pay attention to the port number).
6. Test Launchpad Theme by opening the main theme CSS in a browser: http://localhost:8085/theme/static/themes/default/less/base.less (pay attention to the port number).
7. Test Mashup Services by opening the Mashup Services RSS pipe URL in a browser: http://localhost:8080/portalserver/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/ (pay attention to the port number). Existing RSS pipe fetches RSS feed from url parameter and then applies XSLT transformation to create a snippet of HTML that can be used from some widget for example.
8. Test Content Services by opening the Content Services RSS URL in a browser: http://localhost:8080/portalserver/content/atom (pay attention to the port number) or by using some CMIS client software. More info on how to use [CMIS Workbench](https://my.backbase.com/doc-center/manuals/portal/cont_cont.html#cont_cont_cmis) can be found on the CMIS Workbench page of our documentation.
9. Test Orchestrators by opening the Orchestrator configuration URL in a browser: http://localhost:8080/portalserver/orchestrator/configuration (pay attention to the port number).

##Anatomy
**project**  
-**portalserver**   
--**configuration**  
---**contentservices** --> optional example files that can be used with Content Services  
----**contentRepository**  
-----**importers**  
------**cmis**  
-------alfresco.properties --> example CMIS importer configuration  
------**feed**  
-------BloombergBlog.properties --> example RSS importer configuration  
-----**scheduler**  
------**job**  
-------myjob.properties --> example schedule rjob configuration  
---**jetty**  
----**contentservices**  
-----jetty-web.xml --> jetty JNDI bindings for contentservices web application  
----**orchestrator**  
-----jetty-web.xml --> jetty JNDI bindings for orchestrator web application  
----jetty.xml --> jetty JNDI bindings for portal web application defined with this Maven project  
----webdefaults.xml --> jetty configuration  
---**scripts**  
----**contentservices** --> content services database scripts for all databases we support  
----**foundation** --> portal foundation database scripts for all databases we support  
----**manager** --> portal manager scripts   
----**orchestrator** --> orchestrator database scripts for all databases we support  
----**tracking** --> tracking database scripts for all databases we support  
---**tomcat**  
----context.xml --> tomcat 7 JNDI bindings for portal web application defined with this Maven project   
----server.xml --> tomcat 7 server configuration  
---backbase.properties --> main backbase configuration file  
---ice-config.properties --> backbase ICE configuration file  
---logback.xml --> logback configuration file  
---ptc-config.properties --> Mashup Services configuration properties file  
---ptc-config.xml --> Mashup Services main configuration file    
---to-self-publishchains.xml --> orchestrator configuration file  
--**src**  
---**main**  
----**coreResources**  
-----**import**  
------importPortal.xml --> backbase portal import file for portal without portal manager  
----**dashboardResources**  
-----**import**  
------importPortal.xml --> backbase portal import file for portal with portal manager  
----**java**  
-----**com**  
------**backbase**  
-------**targeting**  
--------**collector**  
---------**examples**  
----------WeatherContextCollector.java --> target collector example  
----**resources**  
-----**import**  
------importPortal.xml --> copy of one from dashboardResources/import  
-----**META-INF**  
------**spring**  
-------**optional**   
--------targeting-connectorframework.xml --> spring configuration for targeting that refers to targetimng example  
-------backbase-portal-application-config.xml --> spring configuration suitable to hook custom spring configurations  
-------backbase-portal-integration-config.xml --> spring configuration suitable to hook custom spring configurations   
----**webapp**  
-----**static**  
------**default**  
-------**css**  
--------backbaseportalserver.css  
-------**media**  
--------BB_logo_.png  
--------bb_ribbon.png  
--------bg_pm.png  
------**lib**  
-------jquery-1.6.1-min.js  
------**RSS**  
-------**xsl**  
--------rss2html.xsl  
-----**WEB-INF**  
------**default** --> default backbase templates  
-------borderlayout.jsp  
-------container.jsp  
-------link.jsp  
-------page.jsp  
-------widget.jsp  
------**import**  
-------chooseImport.jsp --> import portal page  
------ehcache_statistics.jsp --> eh cache statistics page  
------hibernate_statistics.jsp --> hibernate statistics page  
------ibm-web-ext.xmi --> IBM WAS specific configuration file  
------index.jsp  
------jboss-deployment-structure.xml --> JBoss deployment specific configuration file  
------jboss-web.xml--> JBoss specific configuration file  
------portal.tld --> portal's TLD  
------web.xml  
---**test**  
----**java**   
-----**com**  
------**backbase**  
-------**test**  
--------**contentservices**  
---------InstallationValidationTestST.java --> Test used to validate Content Services on embedded server  
--------**mashupservices**  
---------InstallationValidationTestST.java --> Test used to validate embedded Mashup Services on embedded server    
--------**orchestrator**  
---------InstallationValidationTestST.java --> Test used to validate Orchestrator on embedded server   
--------**portalserver**   
---------InstallationValidationTestST.java --> Test used to validate Portal Foundation on embedded server  
----**resources**  
--**tools** --> various tools  
--pom.xml  
-**theme**  
--**configuration**  
---**jetty**  
----webdefaults.xml --> jetty configuration  
--**src**  
---**main**  
----**webapp**  
-----**docs** --> theme documentation   
-----**META-INF**  
-----**static**  
------**themes** --> themese folder    
-------**default** --> default Launchpad theme    
-----**WEB-INF** 
--pom.xml  
-pom.xml  
