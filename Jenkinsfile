pipeline {
    agent any

    environment {
        APP_NAME = "k8s-next-demo"
        ENV_SLUG = "${BRANCH_NAME == 'develop' ? 'dev' : BRANCH_NAME}"
        SHORT_COMMIT = "${GIT_COMMIT[0..7]}"
    }

    stages {
        stage('Trivy Scan') {
            steps {
                sh 'trivy fs . --exit-code 1 -s HIGH,CRITICAL --ignore-unfixed --scanners vuln,misconfig,secret'
            }
            post {
                failure {
                    sh 'echo Trivy Scan Failed'
                }
                success {
                    sh 'echo Trivy Scan Success'
                }
            }
        }

        stage('Docker Login') {
            steps {
                withInfisical(configuration: [infisicalCredentialId: 'jenkins_universal_auth', infisicalEnvironmentSlug: 'dev', infisicalProjectSlug: 'global-quay', infisicalUrl: 'https://infisical.sabihinmolang.eu.org'], infisicalSecrets: [infisicalSecret(includeImports: true, path: '/', secretValues: [[infisicalKey: 'QUAY_PASSWORD'], [infisicalKey: 'QUAY_HOSTNAME'], [infisicalKey: 'QUAY_USERNAME']])]) {
                    sh '''
                        docker login -u ${QUAY_USERNAME} -p ${QUAY_PASSWORD} ${QUAY_HOSTNAME}
                    '''
                }
            }
        }
        stage('Docker Build') {
            steps {
                withInfisical(configuration: [infisicalCredentialId: 'jenkins_universal_auth', infisicalEnvironmentSlug: "${ENV_SLUG}", infisicalProjectSlug: 'k8s-next-demo', infisicalUrl: 'https://infisical.sabihinmolang.eu.org'], infisicalSecrets: [infisicalSecret(includeImports: true, path: '/', secretValues: [[infisicalKey: 'NEXT_PUBLIC_BRANCH'], [infisicalKey: 'NEXT_PUBLIC_USERNAME']])]) {
                    sh '''
                        docker build -t ${APP_NAME}:${BRANCH_NAME} \
                        --build-arg NEXT_PUBLIC_BRANCH="${NEXT_PUBLIC_BRANCH}" \
                        --build-arg NEXT_PUBLIC_USERNAME="${NEXT_PUBLIC_USERNAME}" \
                        .
                    '''
                }
            }
        }
        stage('Tag to Quay') {
            steps {
                withInfisical(configuration: [infisicalCredentialId: 'jenkins_universal_auth', infisicalEnvironmentSlug: 'dev', infisicalProjectSlug: 'global-quay', infisicalUrl: 'https://infisical.sabihinmolang.eu.org'], infisicalSecrets: [infisicalSecret(includeImports: true, path: '/', secretValues: [[infisicalKey: 'QUAY_PASSWORD'], [infisicalKey: 'QUAY_HOSTNAME'], [infisicalKey: 'QUAY_USERNAME']])]) {
                    sh '''
                        docker tag ${APP_NAME}:${BRANCH_NAME} ${QUAY_HOSTNAME}/${QUAY_USERNAME}/${APP_NAME}:${BRANCH_NAME}
                        docker tag ${APP_NAME}:${BRANCH_NAME} ${QUAY_HOSTNAME}/${QUAY_USERNAME}/${APP_NAME}:${SHORT_COMMIT}
                    '''
                }
            }
        }
        stage('Push to Quay') {
            steps {
                withInfisical(configuration: [infisicalCredentialId: 'jenkins_universal_auth', infisicalEnvironmentSlug: 'dev', infisicalProjectSlug: 'global-quay', infisicalUrl: 'https://infisical.sabihinmolang.eu.org'], infisicalSecrets: [infisicalSecret(includeImports: true, path: '/', secretValues: [[infisicalKey: 'QUAY_PASSWORD'], [infisicalKey: 'QUAY_HOSTNAME'], [infisicalKey: 'QUAY_USERNAME']])]) {
                    sh '''
                        docker push ${QUAY_HOSTNAME}/${QUAY_USERNAME}/${APP_NAME}:${BRANCH_NAME}
                        docker push ${QUAY_HOSTNAME}/${QUAY_USERNAME}/${APP_NAME}:${SHORT_COMMIT}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline Success!'
        }
        failure {
            echo 'Pipeline Failed!'
        }
        always {
            sh '''
                docker rmi $(docker image ls --format "{{.Repository}}:{{.Tag}}" | grep ${APP_NAME}) || true
                echo 'Deleted unused images!'
            '''
        }
    }
}
