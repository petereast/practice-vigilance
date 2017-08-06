all:
	mkdir -p deploy
	echo "[info] Building coffeescripts"
	coffee -pc webserver/ws.coffee | uglifyjs -m > ./deploy/ws.js
	coffee -pc webserver/uauth.coffee | uglifyjs -m > ./deploy/uauth.js

	echo "[info] Entering folder webserver/async"
	mkdir -p ./deploy/async
	coffee -pc webserver/async/asyncAdmin.coffee | uglifyjs -m > ./deploy/async/asyncAdmin.js

	echo "[info] Entering folder webserver/active_pages"
	mkdir -p ./deploy/active_pages
	cat webserver/active_pages/dashboard.js | uglifyjs -m > ./deploy/active_pages/dashboard.js

	echo "[info] Copying public pages"
	cp -r webserver/public deploy/public

	echo "[info] Copying static resources"
	cp -r webserver/static deploy/static

	echo "[info] Copying UI elements"
	cp -r webserver/ui deploy/ui

clean:
	rm -rf ./deploy/
