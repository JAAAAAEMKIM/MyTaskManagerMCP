#!/bin/sh
cd /Users/nhn/Projects/MyTaskManagerMCP

# nvm use 명령어 실행 시 출력을 /dev/null로 리디렉션하여 MCP 클라이언트에 영향을 주지 않게 함
. "$NVM_DIR/nvm.sh" > /dev/null 2>&1
nvm use 22 > /dev/null 2>&1

# 빌드 및 서버 실행
npm run start