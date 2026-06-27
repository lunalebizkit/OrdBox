 REM .\publish.bat $(git rev-parse HEAD)
 cd Back
 
 IF NOT "%2" == "front" (
 docker build -f Dockerfile --tag lunale/gestion:api-%1 --tag lunale/gestion:api-latest .
 docker push lunale/gestion:api-%1
 docker push lunale/gestion:api-latest
 )

 cd ..\Front
 IF NOT "%2" == "api" (
 docker build -f Dockerfile --tag lunale/gestion:front-%1 --tag lunale/gestion:front-latest .
 docker push lunale/gestion:front-%1
 docker push lunale/gestion:front-latest
 )