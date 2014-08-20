#Archetypes

Version **5.5.0.0**

##Overview
A collection of Maven archetypes for Backbase CXP created by Expert Services that can help help with initial project setup and various project customizations.

Archetypes are deployed to Backbase Expert Services' Maven repository at

1. PUBLIC RELEASES   					**https://repo.backbase.com/extensions** 
2. INTERNAL RELEASES                	**https://artifacts.backbase.com/backbase-ps-releases**
3. INTERNAL SNAPSHOTS               	**https://artifacts.backbase.com/backbase-ps-snapshots**

##List of currently available archetypes:
1. **backbase-all-in-one-archetype**, from version **5.3.1.1**
2. **backbase-all-in-one-launchpad-archetype**, from version **5.4.1.3**
3. **backbase-contentservices-archetype**, from version **5.4.0.5**
4. **backbase-es-project-archetype**, from version **5.5.0.0**
5. **backbase-launchpad-archetype**, from version **5.5.0.0**
6. **backbase-mashupservices-archetype**, from version **5.4.0.6**
7. **backbase-orchestrator-archetype**, from version **5.4.2.2**
8. **backbase-portalserver-archetype**, from version **5.4.1.3**
9. **backbase-services-archetype**, from version **5.5.0.0**
10. **backbase-targeting-archetype**, from version **5.4.2.2**

##Important Notes
1. We have separated aggregator and parent POMs since 5.5.0.0 so make sure to understand this before making any changes to archetypes. Purpose of this was to separate lifecycle for each archetype if needed and to make sure Maven site plugin works correctly by aggregating reports from all modules.
2. From version **5.5.0.0** we're using **JDK 7** as the default option due to the latest version of embedded Jetty which requires it.

##Usage

###Pre-conditions
We assume that you're already familiar with [Development Guide](https://my.backbase.com/resources/documentation/portal/devd_mave.html) and that you need more additional archetypes for specific needs. These additional archetypes are tailored by needs we have experienced when working with various clients around the world so they represent also a best practice on how to quickly bootstrap your Backbase CXP projector modules and solve some specific tasks related to Backbase CXP.

###Maven repository configuration
Configure your Maven configuration to include the Backbase extensions releases repository (https://repo.backbase.com/extensions).

###Maven archetype project generation: 
<pre>
	$ mvn archetype:generate -DarchetypeArtifactId=<archetype_name> -DarchetypeGroupId=com.backbase.expert.tools -DarchetypeVersion=<archetype_version> 
</pre>

##Contributions
Please feel encouraged to create your own versions of these archetypes by forking the code and further changing it to meet your specific needs if you have them. If you feel change you have on mind is something that other Backbase CXP customers or Backbase Expert Services could use, please feel free to share ideas on Github Issues section or make a pull request.

After you have build these archetypes locally and optionally deploy within your organization, you are ready to start using them. Each archetype is specific so details on usage are within each of them.

In order to use these archetypes, you need to clone or fork code from this Git repository and build it locally:  
<pre>
	$ mvn clean install
</pre>
This way you can use these archetypes from your local Maven repository directly. 

###Deploy within your organization
Optionally, you can also install these archetypes into a Maven repository within your organization. This would enable other people from your organization with access to that Maven repository to use these archetypes. You should do this with Maven deploy plugin. We already use it to deploy to our internal Maven repository so you just need to change Backbase settings into yours. More info on these plugins you can find [here](http://maven.apache.org/plugins/maven-deploy-plugin). Key configuration you need to change is related to distributionManagement section inside aggregator and parent POM files.

This way, your entire organization can use these archetypes from your organization's Maven repository. 

## History of Changes
5.5.0.0 

1. Initial version of Launchpad Archetype and Backbase CXP ES Project Archetype with Launchpad 0.10.0 and Services Archetype. 
2. Alignement of Portal Server, Content Services, Mashup Services, Orchestrator, Targeting, All-In-One and All-In-One with Launchpad archetypes with Backbase Portal suite 5.5.0.0
3. Alignement of All-In-One with Launchpad archetypes with Launchpad 0.10.0
4. Separation of aggregating and parent POM
5. Move to Jetty 9.1.2.v20140210
6. Move to JDK 7
7. Fixing reported bugs
8. Moved RSS target feed for test into application
9. Adding ES best practices for web development
10. Migrated TODO section from this file into GitHub Issues section
11. Upgrade to Mosaic Tools 0.9.5
12. Adding best practices for widget lifecycle through use of YAPI (Mosaic Tools)

5.4.2.2 

1. Alignement of Portal Server, Content Services, Mashup Services, All-In-One and All-In-One with Launchpad archetypes with Backbase Portal suite 5.4.2.2
2. Alignement of All-In-One with Launchpad archetypes with Launchpad 0.8
3. Initial version of Orchestrator Archetype
4. Initial version of Targeting Archetype
5. Rename archetypes to fit uniform naming convention 
6. Making 7777 as a default port for Backbase Portal
7. Change repositories so that Backbase Expert Services Jenkins can perform builds
8. Fixing reported bugs

5.4.1.3 

1. Initial version of Portal Server Archetype 
2. Initial version of Launchpad All-In-One Archetype with Launchpad 0.7
3. Alignement of All-In-One, Content Services and Mashup Services Archetypes with Backbase Portal suite 5.4.1.3
4. Fixing reported bugs
5. Consolidated logging configurations across archetypes
6. Documentation optimization

5.4.0.6 

1. Initial version of Mashup Services Archetype 
2. Alignement of All-In-One and Content Services Archetypes with Backbase Portal suite 5.4.0.6
3. Adding importer.jar to All-In-One Archetype 
4. Documentation optimization

5.4.0.5 

1. Initial version of Content Services Archetype 
2. Alignement of All-In-One Archetype with Backbase Portal suite 5.4.0.5
3. Documentation re-structuring

5.3.1.1 

1. Initial version of All-In-One Archetype
