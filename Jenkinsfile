pipeline {
    agent any

    environment {
        APP_NAME = 'node_app_jenkins'
    }

    stages {

        stage('Checkout Verification') {
            steps {
                echo "Building branch: ${env.BRANCH_NAME}"
                sh 'git rev-parse --abbrev-ref HEAD'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build \
                        -t ${APP_NAME}:${env.BRANCH_NAME}-${BUILD_NUMBER} .
                """
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
                        echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin

                        docker tag ${APP_NAME}:${env.BRANCH_NAME}-${BUILD_NUMBER} \
                                   \$DOCKER_USERNAME/${APP_NAME}:${env.BRANCH_NAME}-${BUILD_NUMBER}

                        docker push \
                                   \$DOCKER_USERNAME/${APP_NAME}:${env.BRANCH_NAME}-${BUILD_NUMBER}
                    """
                }
            }
        }

        stage('Deploy to Development') {
            when {
                branch 'dev'
            }
            steps {
                sh """
                    docker rm -f ${APP_NAME}-dev || true

                    docker run -d \
                        --name ${APP_NAME}-dev \
                        -p 6050:6050 \
                        ${APP_NAME}:dev-${BUILD_NUMBER}
                """
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'stg'
            }
            steps {
                sh """
                    docker rm -f ${APP_NAME}-stg || true

                    docker run -d \
                        --name ${APP_NAME}-stg \
                        -p 6051:6050 \
                        ${APP_NAME}:stg-${BUILD_NUMBER}
                """
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'prod'
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'

                sh """
                    docker rm -f ${APP_NAME}-prod || true

                    docker run -d \
                        --name ${APP_NAME}-prod \
                        -p 6052:6050 \
                        ${APP_NAME}:prod-${BUILD_NUMBER}
                """
            }
        }

        stage('Main Branch') {
            when {
                branch 'main'
            }
            steps {
                echo "Main branch build completed."
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }

        success {
            echo "Build succeeded for ${env.BRANCH_NAME}"
        }

        failure {
            echo "Build failed for ${env.BRANCH_NAME}"
        }
    }
}