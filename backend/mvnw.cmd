@echo off
setlocal
set MAVEN_VERSION=3.9.11
set BASE=%~dp0.mvn\apache-maven-%MAVEN_VERSION%
set MVN=%BASE%\bin\mvn.cmd
if not exist "%MVN%" (
  echo Maven %MAVEN_VERSION% not found locally. Downloading it once...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $url='https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip'; $zip='%TEMP%\apache-maven-%MAVEN_VERSION%-bin.zip'; Invoke-WebRequest -Uri $url -OutFile $zip; Expand-Archive -Force $zip '%~dp0.mvn'; Remove-Item $zip -Force"
  if errorlevel 1 (
    echo Failed to download Maven. Install Maven 3.9+ manually and run: mvn spring-boot:run
    exit /b 1
  )
)
call "%MVN%" %*
