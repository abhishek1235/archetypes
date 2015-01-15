# Archetype backbase-es-project-archetype

Version **5.5.1.0**

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

1. Generate the project. Open a command shell and go to a location where you want to create the content services project. Execute the following command:
    <pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-es-project-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.5.1.0
    </pre>
Refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) for more information.  
2. Optionally adjust JMV properties, differently configure the logback, or make some changes to main configuration file (backbase.properties). For any of these steps refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) or [Install Portal Foundation](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_pofo).  
3. Use the following command from the root project folder to prepare the project for running:
    <pre>
    $ mvn clean install -Dfull-build -Pcreate-database
    </pre>
If you want to run CXP on Jetty run the following Maven command within these folders: portal, contentservices and orchestrator:  
    <pre>
    $ mvn jetty:run
    </pre>
Or, if you want to run Portal on Tomcat 7 run the following Maven command within these folders: portal, contentservices and orchestrator:
    <pre>
    $ mvn tomcat7:run
    </pre>
Optionally run following command from the root project folder to delete and re-create databases when required:
    <pre>
    $ mvn clean -Dfull-build -P clean-database
    </pre>
Note that by default both Jetty and Tomcat for Portal Foundation and Launchpad Theme use the 7777, for Content Services they use 8081 and for Orchestrator they use 8083. In case you need to choose a different ports since you maybe already have another process running on some of these ports, make necessary changes in Jetty and Tomcat plugins within respective POM files before you run any of these components (Portal Foundation, Content Services or Orchestrator).  
4. Test Portal Foundation by opening the Portal Foundation URL in a browser: [http://localhost:7777/portalserver/](http://localhost:7777/portalserver/) (pay attention to the port number).  
5. Test Launchpad Theme by opening the main theme CSS in a browser: [http://localhost:7777/portalserver/static/themes/default/base.css](http://localhost:7777/portalserver/static/themes/default/base.css) (pay attention to the port number).  
6. Test embedded Mashup Services by opening the Mashup Services RSS pipe URL in a browser: [http://localhost:7777/portalserver/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/](http://localhost:7777/portalserver/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/) (pay attention to the port number). Existing RSS pipe fetches RSS feed from url parameter and then applies XSLT transformation to create a snippet of HTML that can be used from some widget for example.  
7. Test, proxied through Portal Foundation, Content Services by opening the Content Services Atom feed in a browser: [http://localhost:7777/portalserver/content/atom](http://localhost:7777/portalserver/content/atom) (pay attention to the port number) or by using some CMIS client software. More info on how to use [CMIS Workbench](https://my.backbase.com/doc-center/manuals/portal/cont_cont.html#cont_cont_cmis) can be found on the CMIS Workbench page of our documentation.  
8. Test, proxied through Portal Foundation, Orchestrators by opening the Orchestrator configuration URL in a browser: [http://localhost:7777/portalserver/orchestrator/configuration](http://localhost:7777/portalserver/orchestrator/configuration) (pay attention to the port number).  

##Anatomy
**project** 
-**configuration** --> Configuration module  
--**assembly**  
---dev.xml --> Dev assembly defintion  
---test.xml --> Test assembly defintion  
--**src**  
---**main**  
----**filters**  
-----dev.properties --> Dev filtering properties  
-----local.properties --> Local filtering properties  
-----test.properties --> Test filtering properties  
----**resources**  
-----**contentservices** --> optional example files that can be used with Content Services  
------**contentRepository**  
-------**importers**  
--------**cmis**  
---------alfresco.properties --> example CMIS importer configuration  
--------**feed**  
---------BloombergBlog.properties --> example RSS importer configuration  
-------**scheduler**  
--------**job**  
---------myjob.properties --> example scheduler job configuration  
-----**db-scripts**  
------**contentservices** --> Content Services database scripts for all databases we support  
------**foundation** --> Portal Foundation database scripts for all databases we support  
------**manager** --> Portal Manager scripts  
------**tracking** --> Tracking database scripts for all databases we support  
------**orchestrator** --> Orchestrator database scripts for all databases we support  
-----**jetty**  
------**contentservices**  
-------jetty.xml --> Jetty JNDI bindings for Content Services  
------**orchestrator**  
-------jetty.xml --> Jetty JNDI bindings for Orchestrator  
------**portal**  
-------jetty.xml --> Jetty JNDI bindings for Portal Foundation  
------webdefaults.xml --> global Jetty configuration  
-----**tomcat**  
------**contentservices**   
-------context.xml --> Tomcat 7 JNDI bindings for Content Services  
------**orchestrator**  
-------context.xml --> Tomcat 7 JNDI bindings for Orchestrator  
------**portal**   
-------context.xml --> Tomcat 7 JNDI bindings for Portal Foundation  
-----backbase.properties --> Main Backbase configuration file  
-----deviceConfig.xml --> Backbase Portal Manager devices configuration  
-----esapi.properties --> Backbase ESAPI configuration file  
-----ice-config.properties --> Backbase ICE configuration file  
-----logback.xml --> Logback configuration file  
-----ptc-config.properties --> Mashup Services configuration properties file  
-----ptc-config.xml --> Mashup Services main configuration file  
-----service-config.xml --> Optional Services configuration file      
-----to-self-publishchains.xml --> orchestrator configuration file  
-----wro.properties --> Wro configuration options  
-----wro.xml --> Wro configuration file  
--build.bat  
--build.sh  
--pom.xml  
-**contentservices** --> Content Services module  
--**src**  
---**main**  
----**java**  
----**resources**  
-----**META-INF**  
------**meta-model**  
------**spring**  
------ehcache.xsd --> Ehcache XSD  
------ehcache-configuration.xml --> Ehcache Configuration repo configurations  
------ehcache-content.xml --> Ehcache Content repo configurations  
------ehcache-resource.xml --> Ehcache Resource repo configurations  
----**webapp**  
-----**static**    
-----version.txt --> Build version info file  
---**test**  
----**java**  
-----**com**  
------**backbase**  
-------**test**  
--------**contentservices**  
---------InstallationValidationTestST.java --> Test used to validate Content Services on embedded server  
----**resources**  
--build.bat  
--build.sh  
--initial_build.bat  
--initial_build.sh  
--pom.xml  
--start.bat  
--start.sh  
-**data** --> Folder where all local data is stored  
-**dist** --> Distribution module  
--**assembly**  
---assembly.xml  
--**release-notes**  
---release_notes.txt  
--build.bat  
--build.sh  
--PACKAGE.md  
--package_procedure.md  
--pom.xml  
--releaseNotes.sh  
-**orchestrator** --> Orchestrator module  
--**src**  
---**main**  
----**java**  
----**resources**  
-----**META-INFO**  
------ehcache-orchestrator.xml --> Ehcache Orchestrator configurations  
-----ehcache-orchestrator.xml --> Ehcache Orchestrator configurations  
----**webapp**  
-----**static**    
-----version.txt --> Build version info file  
---**test**  
----**java**  
-----**com**  
------**backbase**   
-------**test**  
--------**orchestrator**  
---------InstallationValidationTestST.java --> Test used to validate Orchestrator on embedded server  
----**resources**  
--build.bat  
--build.sh  
--initial_build.bat  
--initial_build.sh  
--pom.xml  
--start.bat  
--start.sh  
-**parent** --> Parent module  
--pom.xml  
-**portal** --> Portal Foundation module  
--**src**  
---**main**  
----**config-info**  --> Backbase components configuration files  
-----**import**  --> YAPI import configuration files  
----**coreResources**  
-----**import**  
------importPortal.xml --> Backbase import file for portal without portal manager  
----**dashboardResources**  
-----**import**  
------importPortal.xml --> Backbase import file for portal with portal manager  
----**java**  
-----**com**  
------**backbase**  
-------**services**  
--------FakeAuthenticationFilter.java --> Override for default Launchpad services authentication  
-------**targeting**  
--------**collector**  
---------**examples**  
----------WeatherContextCollector.java --> Targeting collector example  
----**resources**  
-----**conf**  
------uiEditingOptions.js --> Backbase Portal Manager UI editing options configurations  
-----**import**  
------groups.xml --> Launchpad default user groups  
------importPortal.xml --> copy of one from dashboardResources/import  
------users.xml --> Launchpad default users  
-----**META-INF**  
------**meta-model**  
------**spring**  
-------**optional**  
--------targeting-connectorframework.xml --> Spring configuration for Targeting that refers to collector example  
-------backbase-portal-application-config.xml --> Spring configuration suitable to hook custom Spring configurations  
-------backbase-portal-business-security.xml --> Main Spring Security configurations  
-------backbase-portal-integration-config.xml --> Spring configuration suitable to hook custom Spring configurations  
-------backbase-portal-presentation-config.xml --> Main Spring MVC configurations  
-------backbase-portal-presentation-security.xml --> Spring Security presentation configurations  
------ehcache-orchestrator.xml --> Ehcache Orchestrator configurations  
------ehcache.xsd --> Ehcache XSD  
------ehcache-configuration.xml --> Ehcache Configuration repo configurations  
------ehcache-content.xml --> Ehcache Content repo configurations  
------ehcache-resource.xml --> Ehcache Resource repo configurations  
-----backbase-ptc.xml --> Mashup Services Spring Beans configuration file  
-----ehcache-auditing.xml --> Ehcache Portal Audit configurations  
-----ehcache-foundation.xml --> Ehcache Portal Foundation configurations  
-----ehcache-foundation-jgroups-example.xml --> Ehcache Portal Foundation configurations with JGroups enabled  
-----ehcache-orchestrator.xml --> Ehcache Orchestrator configurations  
-----ehcache-persistence.xml --> Ehcache Portal Foundation persistence configurations  
-----ehcache-persistence-jgroups-example.xml --> Ehcache persistence configurations with JGroups enabled  
----**webapp**  
-----**docs-v1**  --> Launchpad theme documentation  
-----**static**  
------**default**  
-------**css**  
--------backbaseportalserver.css  
-------**media**  
--------BB_logo_.png  
--------bb_ribbon.png  
--------bg_pm.png  
------**ext-lib**  
-------jquery-1.8.3-min.js  
------**launchpad** --> Launchpad assets  
------**lp** --> Launchpad assets  
-------**conf** --> Launchpad assets configurations  
--------require-conf.js --> Launchpad RequireJS configurations  
------**RSS**  
-------**xsl**  
--------rss2html.xsl  
-------rss-example-feed.xml  
-----version.txt --> Build version info file  
-----**WEB-INF**  
------**backbase.com.2012.nexus** --> fox for Nexus bundle  
------**common** --> Common Launchpad templates  
-------theme.jsp --> Launchpad theme template include  
------**default** --> default backbase templates  
-------borderlayout.jsp  
-------container.jsp  
-------link.jsp  
-------page.jsp  
-------widget.jsp  
------**import**  
-------chooseImport.jsp --> import portal page  
------**launchpad** --> Launchpad templates  
-------**pages** --> Launchpad templates  
--------launchpad-lib.jsp --> Launchpad libs template include  
------**lp** --> Launchpad templates  
-------**common** --> Launchpad common templates  
--------directives.jspf --> Launchpad directives template include fragment  
-------**includes** --> Launchpad common templates  
--------custom-body.jsp --> Launchpad custom body template include  
--------custom-head.jsp --> Launchpad custom head template include  
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
--------**mashupservices**  
---------InstallationValidationTestST.java --> Test used to validate Mashup Services on embedded server    
--------**portalserver**  
---------InstallationValidationTestST.java --> Test used to validate Portal Foundation on embedded server  
--------**theme**  
---------InstallationValidationTestST.java --> Test used to validate Theme on embedded server  
----**resources**  
--build.bat  
--build.sh  
--initial_build.bat  
--initial_build.sh  
--pom.xml  
--start.bat  
--start.sh  
-**services** --> Parent module for all Services modules  
--**sample-service-module** --> Sampel Services module  
---**src**  
----**main**  
-----**java**  
-----**resources**  
------**META-INF**   
-------backbase-mashup-service.xml --> Apache Camel routes  
------**template**  
-------**velocity**  
--------sample-velocity.wsdl --> Sample Velocity template  
------**wsdl**  
-------weather.wsdl --> Sample WSDL  
------binding.xml --> Apache CXF helper file  
----**test**  
-----**java**  
-----**resources**  
---pom.xml  
--build.bat  
--build.sh  
--pom.xml  
-**statics** --> Parent module for all Web sub modules  
--**bundles** --> Parent module for all Bundles  
---**samples**  --> Sample bundle  
----**assembly**  
-----bundle.xml  
-----change-info.xml  
----**src**  
-----**main**  
------**config-info**  --> Backbase components configuration files  
-------**import**  --> YAPI import configuration files  
--------**samples**  --> Samples bundle YAPI import configuration files  
---------**widgets**  
--------mycomp-myportal.xml  
--------mycomp-myportal-inst-mypage.xml  
--------mycomp-myportal-mapg-mymaster.xml  
--------mycomp-myportal-pc-conts.xml  
--------mycomp-myportal-pc-wdgs.xml  
--------mycomp-myportal-pgs-login.xml  
--------mycomp-myportal-pgs-mypage.xml  
--------mycomp-myportal-root-links.xml  
--------mycomp-sc-cont-myContainer.xml  
--------mycomp-sc-conts.xml  
--------mycomp-sc-wdg-sample.xml  
--------mycomp-sc-wdgts.xml  
--------mycomp-tmps-conts.xml  
--------mycomp-tmps-pgs.xml  
--------mycomp-users.xml  
------**webapp**  
-------**static**  
--------**samples**  
---------**chromes**  
-----------**blank**  
------------chrome-blank.html  
----------**conf**  
----------**containers**  
----------**html**  
-----------**chromes**  
------------chrome-blank.html  
-----------portalAction.html  
----------**js**  
-----------**vendor**  
------------jquery-1.10.2.min.js  
-----------main.js  
-----------plugins.js  
----------**lib**  
----------**media**  
-----------apple-touch-icon-precomposed.png  
-----------favicon.ico  
-----------portal-image.png  
----------**support**  
----------**widgets**  
-----------**sample**  
------------**css**  
-------------sample.css  
------------**import**  
-------------myComp-sc-wdg-sample.xml  
------------**js**  
-------------sample.js  
------------icon.png  
------------index.html   
------------README.md  
----pom.xml  
---pom.xml  
--**themes** --> Parent module for all Themes  
---**launchpad-default** --> Launchpad default theme  
---**launchpad-example** --> Launchpad example theme  
---pom.xml  
--build.bat   
--build.sh  
--pom.xml  
--README.md  
-**tools** --> Folder with various Backbase tools  
--**grunt** --> Various Grunt scripts  
--**nodejs** --> Various NodeJS scripts   
--importer-5.5.0.0-jar-with-dependencies.jar --> Backbase Importer tool  
-build.bat  
-build.sh  
-initial_build.bat  
-initial_build.sh  
-pom.xml  
-README.md   
-start.bat  
-start.sh  
