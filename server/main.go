package main

import (
	"fmt"
	"log"
	"net/http"

	//"encoding/json"
	"io/ioutil"

	"github.com/gorilla/mux"
	//"github.com/julienschmidt/httprouter"
)

func AddCorsHeader(writer http.ResponseWriter) {
	writer.Header().Set("Access-Control-Allow-Headers", "*")
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
}

type application struct {
}

func (app *application) home(writer http.ResponseWriter, request *http.Request) {
	API_GATEWAY_URL := "https://6idh9fsfmg.execute-api.us-east-2.amazonaws.com/nuka-api"

	req, _ := http.NewRequest("GET", API_GATEWAY_URL+"/cluster", nil)
	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error Request: ", err)
	}
	defer resp.Body.Close()

	json, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(json))

	writer.Header().Set("Content-Type", "application/json")
	AddCorsHeader(writer)
	writer.WriteHeader(http.StatusOK)
	writer.Write(json)
}

func (app *application) StartCluster(writer http.ResponseWriter, request *http.Request) {
	API_GATEWAY_URL := "https://6idh9fsfmg.execute-api.us-east-2.amazonaws.com/nuka-api"

	vars := mux.Vars(request)
	clusterId := vars["clusterId"]
	endpoint := API_GATEWAY_URL + "/cluster/" + clusterId + "/start"

	fmt.Println("Start Cluster: " + clusterId + " => " + endpoint)

	req, _ := http.NewRequest("POST", endpoint, nil)
	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error Request: ", err)
		return
	}

	defer resp.Body.Close()

	json, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(json))

	writer.Header().Set("Content-Type", "application/json")
	AddCorsHeader(writer)
	writer.WriteHeader(http.StatusOK)
}

func (app *application) StopCluster(writer http.ResponseWriter, request *http.Request) {
	API_GATEWAY_URL := "https://6idh9fsfmg.execute-api.us-east-2.amazonaws.com/nuka-api"

	vars := mux.Vars(request)
	clusterId := vars["clusterId"]
	endpoint := API_GATEWAY_URL + "/cluster/" + clusterId + "/stop"

	fmt.Println("Stop Cluster: " + clusterId + " => " + endpoint)

	req, _ := http.NewRequest("POST", endpoint, nil)
	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error Request: ", err)
		return
	}

	defer resp.Body.Close()

	json, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(json))

	writer.Header().Set("Content-Type", "application/json")
	AddCorsHeader(writer)
	writer.WriteHeader(http.StatusOK)
}

func (app *application) routes() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/", app.home)
	router.HandleFunc("/{clusterId}/start", app.StartCluster)
	router.HandleFunc("/{clusterId}/stop", app.StopCluster)
	return router
}

func main() {
	app := &application{}

	server := &http.Server{
		Addr:    ":3001",
		Handler: app.routes(),
	}

	err := server.ListenAndServe()
	if err != nil {
		log.Println(err)
	}
}
