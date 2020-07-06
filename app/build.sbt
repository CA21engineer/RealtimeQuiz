import Settings._

lazy val domain = (project in file("domain"))
  .settings(baseSettings)
  .settings(commonDependenciesSettings)

lazy val infrastructure = (project in file("infrastructure"))
  .settings(baseSettings)
  .settings(commonDependenciesSettings)
  .dependsOn(domain)

lazy val application = (project in file("application"))
  .settings(baseSettings)
  .settings(commonDependenciesSettings)
  .dependsOn(infrastructure)

lazy val apiServer = (project in file("apiServer"))
  .enablePlugins(JavaAppPackaging, AshScriptPlugin, DockerPlugin)
  .settings(baseSettings)
  .settings(commonDependenciesSettings)
  .settings(dockerSettings)
  .dependsOn(application)

lazy val root =
  (project in file("."))
    .aggregate(apiServer)
    .settings(dockerSbtCommand)
