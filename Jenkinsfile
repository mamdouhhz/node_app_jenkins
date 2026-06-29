@Library('jenkins-shared-lib') _
pipeline {
    agent any

    environment {
        APP_NAME = 'node_app_jenkins'
        REPO_URL = "https://github.com/mamdouhhz/node_app_jenkins.git"
    }

    stages {
        stage('Getting Repo files') {
            steps {
                git branch: "${GIT_BRANCH}", credentialsId: 'github', url: "${REPO_URL}"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${APP_NAME}:${BUILD_NUMBER} .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {

                        sh """
                            echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin

                            docker tag ${APP_NAME}:${BUILD_NUMBER} ${DOCKER_USERNAME}/${APP_NAME}:${BUILD_NUMBER}

                            docker push ${DOCKER_USERNAME}/${APP_NAME}:${BUILD_NUMBER}
                        """

                    }
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    sh """
                        docker run -p 6050:6050 --name "${APP_NAME}"-"main"-${BUILD_NUMBER} -d ${APP_NAME}:${BUILD_NUMBER}
                        docker ps
                    """
                }
            }
        }
        stages {
            stage('Send Greeting') {
                steps {
                    // Call the shared library function
                    greet('You are doing great, keep learning!')
                }
            }
        }
    }
}