#Archetypes

##Overview

A collection of Maven archetypes for Backbase Portal created by Expert Services that can help help with initial project setup.

This assumes you're already familiar with Backbase Development setup available at https://my.backbase.com/doc-center/manuals/portal/inst_devl.html and need more advanced archetypes. These advanced archetypes are tailored by needs we have experienced when working with various clients around the world so they represent also a best practice on how to quickly bootstrap your project.

##List of currently available archetypes:
1. backbase-portal-archetype-all-in-one from version 5.3.1.1

More are to come shortly.

##Usage

In order to use these archetypes, you need to pull or fork code from this git repository, build it locally and then install it into a Maven repository inside your organization. This will enable other people within your organization with access to that Maven repository to use these archetypes. Of course, you can also use them from your local Maven repository without need to install them on remote Maven repository but then only you will be able to use them.

Feel encouraged to create your own versions by forking the code and further changing it to meet your specific needs if you have them. If you feel chnage you have on mind is more of a generic chnage, share ideas on github Issues section.

After you have enabled these archetypes locally or accross your organization, you are ready to start using them. Usage is almost the same as already explained for default archetype on page https://my.backbase.com/doc-center/manuals/portal/inst_devl.html 

In next few lines we are giving modifications to a reference page from this manual

###7 Development Setup

Following steps are replacing/complementing 12 steps described in Development Setup Procedure.

1. As-is.
2. All is the same except that we ned to use this archetype, so Maven command would look like this:
```
mvn archetype:generate -DarchetypeArtifactId=<archetype-name> -DarchetypeGroupId=com.backbase.expert.tools.archetypes -DarchetypeVersion=<archetype-version>
```
3. As-is.
4. As-is.
5. Logback is already pre-configured and configuration file for it is located in a configuration folder.
6. Properties configuration file is already pre-configured and it is located in a configuration folder.
7. Environment entries are already defined within Jetty and Tomcat configuration files that are located inside the configuration/jetty and configuration/tomcat folders.
8. Done inside a properties configuration file as part of step #6.
9. Pre-configured for 1.6.
10. Pre-configured.
11. As-is.
12. As-is.

####7.1 Maven Settings File
As-is.

####7.2 Database setup (optional)
Jetty and Tomcat files with data-source configurations are located inside configuration/jetty and configuration/tomcat folders. Everything else is as-is.

####7.3 Portal Example
As-is.

####7.4 Test

Following steps are replacing/complementing 4 steps described in this section.

1. Use the following commands instead
```
mvn clean install -P create-database
```

```
mvn jetty:run-war if you want to use Jetty 
```

OR 

```
mvn tomcat7:run-war if you want to use Tomcat 7
```

Optionally run following command to delete and re-create databases when required 
```
mvn clean -P clean-database
```

Both Jetty and Tomcat use 8080 ports.

2. As-is.
3. As-is.
4. As-is.
