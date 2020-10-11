pipeline {
    agent any

    tools {
        nodejs "Node12"
    }

    stages {
        stage('Test') {
            steps {
                git 'https://github.com/Ucaly/puppeteer-test-example.git'
                sh "rm -rf ${env.WORKSPACE}/report.xml"
                sh "docker build -t puppeteer-chrome-linux ."
                sh "docker run --init --rm -v ${env.WORKSPACE}/:/results/ --security-opt seccomp=seccomp/chrome.json puppeteer-chrome-linux"
                // -v ${env.WORKSPACE}/results:/results
                // sh "yarn install && yarn test"
            }
            // steps {
            //     sh "docker rmi $(docker images -q -f dangling=true)"
            // }
            post {
                success {
                    junit "report.xml"
                }
            }
        }
    }
}