#Archetype overview

This archetype generates stand-alone test automation project using Protractor v3.3.0.

**Current version: 2.2**

Development version: 2.3-SNAPSHOT

Archetypes are deployed to Backbase Expert Services' Maven repository at

1. PUBLIC RELEASES   					**https://repo.backbase.com/extensions** 
2. INTERNAL RELEASES                	**https://artifacts.backbase.com/backbase-ps-releases**
3. INTERNAL SNAPSHOTS               	**https://artifacts.backbase.com/backbase-ps-snapshots**

Automatic build: http://esjnks.backbase.com/view/Mosaic%20Bundles/job/mosaic-archetypes/

#Usage

To build and install the archetype run

<pre>
	$ mvn clean install
</pre>

To generate a project based on this archetype run

<pre>
	$ mvn archetype:generate -DarchetypeGroupId=com.backbase.expert.tools -DarchetypeArtifactId=backbase-e2e-tests-archetype -DarchetypeVersion=2.1
</pre>

#Licence 

Licence: ASL 2.0
This is open-source software licenced under ASL 2.0. Modification, redistribution and contribution is encouraged.

