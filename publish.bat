 REM .\publish.bat $(git rev-parse HEAD)
 cd Back
 
 IF NOT "%2" == "front" (
 docker build -f Dockerfile --tag fdufour/gestion:api-%1 --tag fdufour/gestion:api-latest .
 docker push fdufour/gestion:api-%1
 docker push fdufour/gestion:api-latest
 )

 cd ..\Front
 IF NOT "%2" == "api" (
 docker build -f Dockerfile --tag fdufour/gestion:front-%1 --tag fdufour/gestion:front-latest .
 docker push fdufour/gestion:front-%1
 docker push fdufour/gestion:front-latest
 )