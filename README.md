#Archetypes

Version **5.4.2.4**

##Overview
A collection of Maven archetypes for Backbase Portal created by Expert Services that can help help with initial project setup and various project customizations.

Archetypes are deployed to Backbase Expert Services' Maven repository at

1. PUBLIC RELEASES   					**https://repo.backbase.com/extensions** 
2. INTERNAL RELEASES                	**https://artifacts.backbase.com/backbase-ps-releases**
3. INTERNAL SNAPSHOTS               	**https://artifacts.backbase.com/backbase-ps-snapshots**

##List of currently available archetypes:
1. **backbase-all-in-one-archetype**, from version **5.3.1.1**
2. **backbase-contentservices-archetype**, from version **5.4.0.5**
3. **backbase-mashupservices-archetype**, from version **5.4.0.6**
4. **backbase-portalserver-archetype**, from version **5.4.1.3**
5. **backbase-all-in-one-launchpad-archetype**, from version **5.4.1.3**
6. **backbase-orchestrator-archetype**, from version **5.4.2.2**
7. **backbase-targeting-archetype**, from version **5.4.2.2**

##Usage

###Pre-conditions
We assume you're already familiar with [Backbase Development Guide](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) and that you need more advanced archetypes. These advanced archetypes are tailored by needs we have experienced when working with various clients around the world so they represent also a best practice on how to quickly bootstrap your project and solve some specific tasks related to Backbase suite of products.

###Maven repository configuration
Configure your Maven configuration to include the Backbase extensions releases repository (https://repo.backbase.com/extensions).

###Maven archetype project generation: 
<pre>
	$ mvn archetype:generate -DarchetypeArtifactId=<archetype_name> -DarchetypeGroupId=com.backbase.expert.tools -DarchetypeVersion=<archetype_version> 
</pre>

##Customization
Feel encouraged to create your own versions of these archetypes by forking the code and further changing it to meet your specific needs if you have them. If you feel change you have on mind is more of a generic change and other Backbase customers could use it, please feel free to share ideas on Github Issues section.

After you have build these archetypes locally and optionally deploy accross your organization, you are ready to start using them. Each archetype is specific so details on usage are within each of them.

In order to use these archetypes, you need to pull or fork code from this Git repository and build it locally:  
<pre>
	$ mvn clean install
</pre>
This way you can use these archetypes from your local Maven repository directly. 

###Deploy within your organization
Optionally, you can also install these archetypes into a Maven repository within your organization. This would enable other people from your organization with access to that Maven repository to use these archetypes. You should do this with Maven deploy plugin. We already use it to deploy to our internal Maven repository so you just need to chnage our settings into yours. More info on this plugin you can find [here](http://maven.apache.org/plugins/maven-deploy-plugin). Key configuration you need to change is related to distributionManagement section inside main POM file.

This way, all your coleagues can use these archetypes from your organization's Maven repository. 

## History of Changes
5.4.2.2 

1. Alignement of Basic, Content Services, Mashup Services, All-In-One and All-In-One with Launchpad archetypes with 5.4.2.2 version of Backbase Portal suite
2. Initial version of Orchestrator Archetype
3. Initial version of Targeting Archetype
4. Rename archetypes to fit uniform naming convention 
5. Making 7777 as a default port for Backbase Portal
6. Change repositories so that Backbase Expert Services Jenkins can perform builds
7. Fixing reported bugs

5.4.1.3 

1. Initial version of Basic Archetype 
2. Initial version of Launchpad All-In-One Archetype
3. Alignement of All-In-One, Content Services and Mashup Services Archetypes with 5.4.1.3 version of Backbase Portal suite
4. Fixing reported bugs
5. Consolidated logging configurations across archetypes
6. Documentation optimization

5.4.0.6 

1. Initial version of Mashup Services Archetype 
2. Alignement of All-In-One and Content Services Archetypes with 5.4.0.6 version of Backbase Portal suite
3. Adding importer.jar to All-In-One Archetype 
4. Documentation optimization

5.4.0.5 

1. Initial version of Content Services Archetype 
2. Alignement of All-In-One Archetype with 5.4.0.5 version of Backbase Portal suite
3. Documentation re-structuring

5.3.1.1 

1. Initial version of All-In-One Archetype