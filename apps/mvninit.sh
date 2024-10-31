#!/bin/sh

# Create initial maven project

mvn archetype:generate \
    -DgroupId=com.learnwords.wikiscraper \
    -DartifactId=wikiscraper \
	  -DarchetypeArtifactId=maven-archetype-quickstart \
	  -DjavaCompilerVersion=17 \
	  -DjunitVersion=5.11.0
