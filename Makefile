all:
	mkdir -p deploy
	echo "[info] Building coffeescripts"
	coffee -pc webserver/ws.coffee | uglifyjs > ./deploy/ws.js
	

clean:
	rm -rf ./deploy/
