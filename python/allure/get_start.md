# Allure Framework

::: tip Tip
*allure version*: `2.23.1`. Only the lastest version is maintained.

*offical doc*: [Allure Framework](https://docs.qameta.io/allure/)
:::

Allure Framework is a flexible lightweight multi-language test report tool that not only shows a very concise representation of what have been tested in a neat web report form, but allows everyone participating in the development process to extract maximum of useful information from everyday execution of tests.

From the dev/qa perspective Allure reports shorten common defect lifecycle: test failures can be divided on bugs and broken tests, also logs, steps, fixtures, attachments, timings, history and integrations with TMS and bug-tracking systems can be configured, so the responsible developers and testers will have all information at hand.

From the managers perspective Allure provides a clear 'big picture' of what features have been covered, where defects are clustered, how the timeline of execution looks like and many other convenient things. Modularity and extensibility of Allure guarantees that you will always be able to fine-tune something to make Allure suit you better.

## About

### Copyright

The Allure reference guide is available as HTML documents. The latest copy is available at <https://docs.qameta.io/allure/>

Copies of this document may be made for your own use and for distribution to others, provided that you do not charge any fee for such copies and further provided that each copy contains this Copyright Notice, whether distributed in print or electronically.

### Get Help

There are several places to get help:

- Contact the community on [Gitter](https://gitter.im/allure-framework/allure-core). We also have a [Russian-speaking room](https://gitter.im/allure-framework/allure-ru).

- Ask a question on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=allure) or [Stack Overflow in Russian](https://ru.stackoverflow.com/questions/ask?tags=allure).

- Report bugs in [GitHub issues](https://github.com/allure-framework/allure2/issues/new?).

### How to Proceed

- Open the [demo version](http://demo.qameta.io/allure/latest/) to see what an Allure report looks like.

- Go to [Get started](https://docs.qameta.io/allure/latest/#_get_started) to build a report for an existing project.

- Learn more about [report structure and features](https://docs.qameta.io/allure/latest/#_report_structure).

- Integrate your favorite testing framework with Allure. Supported frameworks are grouped by language: `Java`, `Python`, `JavaScript`, `Ruby`, `Groovy`, `PHP`, `.Net`, and `Scala`.

## Get Started

To generate your first report you will need to go through just a few simple steps:

- Downloading and installing Allure commandline application suitable for your environment.

- Locating test execution data that you have to build a report on.

### Installing a commandline

Several options for Allure installation are currently supported:

#### Linux

For debian-based repositories a PPA is provided:

```shell
sudo apt-add-repository ppa:qameta/allure
sudo apt-get update 
sudo apt-get install allure
```

#### Mac OS X

For Mas OS, automated installation is available via [Homebrew](https://brew.sh/)

```shell
brew install allure
```

#### Windows

For Windows, Allure is available from the [Scoop](http://scoop.sh/) commandline-installer.

To install Allure, download and install Scoop and then execute in the Powershell:

```shell
scoop install allure
```

Also Scoop is capable of updating Allure distribution installations. To do so navigate to the Scoop installation directory and execute

```bat
\bin\checkver.ps1 allure -u
```

This will check for newer versions of Allure, and update the manifest file. Then execute

```shell
scoop update allure
```

to install a newer version. ([documentation](https://github.com/lukesampson/scoop/wiki/App-Manifest-Autoupdate))

#### Manual installation

1. Download the latest version as zip archive from [Maven Central](https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/).

2. Unpack the archive to allure-commandline directory.

3. Navigate to `bin` directory.

4. Use `allure.bat` for Windows or `allure` for other Unix platforms.

5. Add `allure` to system `PATH`.

::: warning
To run commandline application, Java Runtime Environment must be installed.
:::

::: tip
Older releases (⇐ `2.8.0`) are available on [bintray](https://bintray.com/qameta/generic/allure2).
:::

#### Check the installation

Execute `allure --version` in console to make sure that allure is now available:

```shell
$ allure --version
2.0.1
```

### Test execution

::: warning
If you are using IDE to run tests locally it may ignore Allure configuration specified in build file (as IntelliJ IDEA does). In order to make it work consider using allure.properties file to configure Allure. Check out [configuration section](https://docs.qameta.io/allure-report/#_configuration) for more information.
:::

Before building a report you need to run your tests to obtain some basic test report data. Typically it might be a junit-style xml report generated by nearly every popular test framework. For example, suppose you have test reports automatically created by surefire maven plugin stored in the `target/surefire-reports`:

![surefire_report_folder](/allure/surefire_report_folder.png)

2.3. Report generation
This is already enough to see the Allure report in one command:

allure serve /home/path/to/project/target/surefire-reports/

Which generates a report in temporary folder from the data found in the provided path and then creates a local Jetty server instance, serves generated report and opens it in the default browser. It is possible to use a --profile option to enable some pre-configured allure setting. junit profile is enabled by default, you will learn more about profiles in the following section.

This would produce a report with a minimum of information extracted from the xml data that will lack nearly all of the advanced allure features but will allow you to get a nice visual representation of executed tests.

Report generated on xml data
1. Report structure
Once you’ve got the idea what the report does look like. You will probably want to get more data-rich reports. You might have to consider using one of the Allure adaptors for your testing framework, which will allow to collect much more information. Jump to the integrations section to learn more about integration with testing frameworks.

Typical report consists of 'Overview' tab, navigation bar, several tabs for different kinds of test data representation and test case pages for each individual test. Each Allure report is backed by a tree-like data structure, that represents a test execution process. Different tabs allow to switch between the views of the original data structure thus giving a different perspective. Note that all tree-like representations including Behaviors, Categories, xUnit and Packages support filtering and are sortable.

3.1. Overview page
Entry point for every report would be the 'Overview' page with dashboards and widgets:

Overview
Overview page hosts several default widgets representing basic characteristics of your project and test environment.

Statistics - overall report statistics.

Launches - if this report represents several test launches, statistics per launch will be shown here.

Behaviors - information on results aggregated according to stories and features.

Executors - information on test executors that were used to run the tests.

History Trend - if tests accumulated some historical data, it’s trend will be calculated and shown on the graph.

Environment - information on test environment (see how to define environment).

Home page widgets are draggable and configurable. Also, Allure supports it’s own plugin system, so quite different widget layouts are possible.

Navigation bar is collapsible and enables you to switch into several of the basic results overview modes.

3.2. Categories
Categories tab gives you the way to create custom defects classification to apply for test results.

Categories
3.3. Suites
On the Suites tab a standard structural representation of executed tests, grouped by suites and classes can be found.

Suites
3.4. Graphs
Graphs allow you to see different statistics collected from the test data: statuses breakdown or severity and duration diagrams.

Graphs
3.5. Timeline
Timeline tab visualizes retrospective of tests execution, allure adaptors collect precise timings of tests, and here on this tab they are arranged accordingly to their sequential or parallel timing structure.

Timeline
3.6. Behaviors
For Behavior-driven approach, this tab groups test results according to Epic, Feature and Story tags.

Behaviors
3.7. Packages
Packages tab represents a tree-like layout of test results, grouped by different packages.

Packages
3.8. Test case page
From some of the results overview pages described above you can go to the test case page after clicking on the individual tests. This page will typically contain a lot of individual data related to the test case: steps executed during the test, timings, attachments, test categorization labels, descriptions and links.

Test result page
4. Features
This section describes the main features of Allure. For example, you can group your tests by stories or features, attach files, and distribute assertions over a set of custom steps, among other features. All features are supported by Java test frameworks, so we only provide Java examples here. For details on how a particular adapter works with the test framework of your choice, refer to the adapter guide.

4.1. Flaky tests
In real life not all of your tests are stable and always green or always red. A test might start to "blink" i.e. it fails from time-to-time without any obvious reason. You could disable such a test, that is a trivial solution. However what if you do not want to do that? Say you would like to get more details on possible reasons or the test is so critical that even being flaky it provides helpful information? You have an option now to mark such tests in a special way, so the resulting report will clearly show them as unstable:

@Flaky
public void aTestWhichFailsFromTimeToTime {
     ...
}
Here is what you get in the report if such a test failed:

A failed test marked as flaky
you can mark a whole test class as flaky as well.
4.2. Environment
To add information to Environment widget just create environment.properties (or environment.xml) file to allure-results directory before report generation.

environment.properties
Browser=Chrome
Browser.Version=63.0
Stand=Production
environment.xml
<environment>
    <parameter>
        <key>Browser</key>
        <value>Chrome</value>
    </parameter>
    <parameter>
        <key>Browser.Version</key>
        <value>63.0</value>
    </parameter>
    <parameter>
        <key>Stand</key>
        <value>Production</value>
    </parameter>
</environment>
4.3. Categories
There are two categories of defects by default:

Product defects (failed tests)

Test defects (broken tests)

To create custom defects classification add categories.json file to allure-results directory before report generation.

categories.json
[
  {
    "name": "Ignored tests", 
    "matchedStatuses": ["skipped"] 
  },
  {
    "name": "Infrastructure problems",
    "matchedStatuses": ["broken", "failed"],
    "messageRegex": ".*bye-bye.*" 
  },
  {
    "name": "Outdated tests",
    "matchedStatuses": ["broken"],
    "traceRegex": ".*FileNotFoundException.*" 
  },
  {
    "name": "Product defects",
    "matchedStatuses": ["failed"]
  },
  {
    "name": "Test defects",
    "matchedStatuses": ["broken"]
  }
]
(mandatory) category name
(optional) list of suitable test statuses. Default ["failed", "broken", "passed", "skipped", "unknown"]
(optional) regex pattern to check test error message. Default ".*"
(optional) regex pattern to check stack trace. Default ".*"
Test result falls into the category if its status is in the list and both error message and stack trace match the pattern.

categories.json file can be stored in test resources directory in case of using allure-maven or allure-gradle plugins.