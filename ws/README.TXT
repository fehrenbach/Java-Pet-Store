Welcome to the Petstore Demo
----------------------------


1. Setup

A. Start Derby - This needs to happen before you setup
You can run derby in server mode or embedded mode. I
recommend embedded server mode.

Embedded Mode:

From the apps/petstore directory type:

ant start-db

Network Server Mode:

Go to:

GLASSFISH_HOME/derby/frameworks/NetworkServer/bin

Start the Server: 
and type

Windows:
 
startNetworkServer

Unix:

ksh startNetworkServer.ksh

Note there is a bug with MacOS X and Derby and you will
need to copy the 

lib/derby/startNetworkServer.ksh to

GLASSFISH_HOME/derby/frameworks/NetworkServer/bin

and lib/derby/derby.properties to

GLASSFISH_HOME/derby


B. Do the setup

Go to the Petstore directory apps/petstore and type ant setup

2. Building

from apps/petstore type:

ant

3. Deploying

from apps/petstore type:

ant deploy

3. Running

from apps/petstore type:

ant launch

or open your browser to:

http://localhost:8080/petstore/
