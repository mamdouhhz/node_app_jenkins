pipeline {
    agent any

    environment {
        APP_NAME = 'node_app_jenkins'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build \
                            -t ${APP_NAME}:${BRANCH_NAME}-${BUILD_NUMBER} .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh """
                        echo "${DOCKER_PASSWORD}" | docker login \
                            -u "${DOCKER_USERNAME}" \
                            --password-stdin

                        docker tag \
                            ${APP_NAME}:${BRANCH_NAME}-${BUILD_NUMBER} \
                            ${DOCKER_USERNAME}/${APP_NAME}:${BRANCH_NAME}-${BUILD_NUMBER}

                        docker push \
                            ${DOCKER_USERNAME}/${APP_NAME}:${BRANCH_NAME}-${BUILD_NUMBER}

                        docker logout
                    """
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    sh """
                        docker rm -f ${APP_NAME}-${BRANCH_NAME} || true

                        docker run -d \
                            --name ${APP_NAME}-${BRANCH_NAME} \
                            -p 6050:6050 \
                            ${DOCKER_USERNAME}/${APP_NAME}:${BRANCH_NAME}-${BUILD_NUMBER}

                        docker ps
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Build completed successfully."
        }

        failure {
            echo "Build failed."
        }

        always {
            cleanWs()
        }
    }
}