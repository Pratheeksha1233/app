import React, { Component } from "react";
import axios from "axios";
export class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jokes: [],
      favorites: [],
      timer: true,
    };
  }

  componentDidMount() {
    this.myInterval = setInterval(() => {
      this.updateFavByOne();
    }, 5000);

    axios
      .get("https://api.icndb.com/jokes/random/10")
      .then((response) => {
        // console.log(response.data.value[0].id);
        let data = JSON.parse(localStorage.getItem("favo"));
        //let data = localStorage.getItem("favo");
        //console.log(data);

        this.setState({
          jokes: response.data.value,
          favorites: data == null ? [] : data,
          // favorites: data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  updateFavByOne() {
    // console.log('hi');
    if (this.state.timer && this.state.favorites.length < 10) {
      axios
        .get("https://api.icndb.com/jokes/random/1")
        .then((response) => {
          const j = this.state.favorites.findIndex(function (joke, index) {
            return joke.id === response.data.value[0].id;
          });

          if (j < 0) {
            const favarr = Object.assign([], this.state.favorites);
            favarr.push(response.data.value[0]);
            this.setState({
              favorites: favarr,
            });
            localStorage.setItem("favo", JSON.stringify(favarr));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  deletejoke(id) {
    // console.log(id);
    const favarr = Object.assign([], this.state.favorites);
    const i = favarr.findIndex(function (joke, index) {
      return joke.id === id;
    });
    favarr.splice(i, 1);
    this.setState({
      favorites: favarr,
    });
    localStorage.setItem("favo", JSON.stringify(favarr));
  }

  addtofav(id) {
    const i = this.state.jokes.findIndex(function (joke, index) {
      return joke.id === id;
    });
    // this.state.jokes[i];

    const j = this.state.favorites.findIndex(function (joke, index) {
      return joke.id === id;
    });

    if (j < 0 && this.state.favorites.length < 10) {
      const favarr = Object.assign([], this.state.favorites);
      favarr.push(this.state.jokes[i]);
      this.setState({
        favorites: favarr,
      });
      localStorage.setItem("favo", JSON.stringify(favarr));
    }
  }

  render() {
    const { jokes, favorites, timer } = this.state;

    return (
      <div>
        <h1 style={{ textAlign: "center" }}>JOKES APP</h1>
        <hr />
        <br />
        <br />
        <div style={{ float: "left", width: "40%" }}>
          <div>
            {jokes.map((jok) => (
              <div key={jok.id}>
                {jok.joke}
                <button onClick={this.addtofav.bind(this, jok.id)}>
                  add to fav
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* <hr style={{ width:"100px", transform: "rotate(90deg)" }} /> */}
        <div style={{ float: "right", width: "40%" }}>
          <h3>RANDOM JOKES</h3>
          <button
            onClick={() => {
              this.setState({ timer: !timer });
            }}
          >
            Timer :{timer ? <span>On</span> : <span>Off</span>}
          </button>
          {favorites.map((favorite) => (
            <div key={favorite.id}>
              {favorite.joke}
              <button onClick={this.deletejoke.bind(this, favorite.id)}>
                delete
              </button>
            </div>
          ))}
        </div>
        <br />
        <br />
        <br />
        <br />
        <hr style={{ width: "100%" }} />;
      </div>
    );
  }
}

export default Page;
