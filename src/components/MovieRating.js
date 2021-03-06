import React from "react";
import StarRate from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import { runGraphQLQuery } from "../utils/Utils";
import styled from "styled-components";

/*

Add a rating for a move
*/
class MovieRating extends React.Component {
  state = {
    rating: -1
  };

  // Når du holder musen over.
  updateRating = n => {
    if (!this.state.ratingFinal) this.setState({ rating: n });
  };

  // Når du trykker på en stjerne.
  setFinal = n => {
    this.setState({ rating: n, ratingFinal: true });
  };

  // graphql query for å legge til ny rating på en film
  submitRating = () => {
    if (this.state.rating <= 0) {
      alert("You must choose a rating before clicking send.")
      return;
    }
    const query = `
    mutation addRating($userId: String!, $movieId: Int!, $rating: Float!) {
      addRating(userId: $userId, movieId: $movieId, rating: $rating) {
        rating
        timestamp
        count
      }
    }`;
    // Datasettet vi bruker gir filmer rating mellom 0.5 og 5 hvor man kan gi f.eks 2.5
    // Vi ønsket å ha ratings som heltall mellom 1 og 10. Derfor plusser vi på en og ganger med to.
    runGraphQLQuery(query, { movieId: this.props.movieId, userId: this.props.userId, rating: (this.state.rating + 1) / 2 }).then(() => {
      // Etter dette queryet er ferdig så kan vi kjøre ratingHasUpdated. Viktig å bruke .then til dette fordi runGraphQLQuery er an async funksjon og vi vil ikke kjøre en annen query f.eks å hente denne ratingen før denne er ferdig.
      this.props.ratingHasUpdated();
    });
  };

  render() {
    const stars = [...Array(10)].map((n, i) => (
      <StarRate
        key={i}
        onMouseEnter={() => this.updateRating(i)}
        onClick={() => this.setFinal(i)}
        style={{ fontSize: 30, cursor: "pointer", color: this.state.rating >= i ? "#ff9800" : "gray" }}
        className={"starRating" + (i + 1)}
      />
    ));
    const RateBox = styled.div`
      display: flex;
      justify-content: center
      flex-direction: column;
      padding: 10px;
    `;
    return (
      <RateBox onMouseLeave={() => this.updateRating(-1)}>
        <div>{stars}</div>
        <Button style={{ marginRight: 10 }} variant="contained" color="primary" onClick={this.submitRating} className="ratingButton">
          Rate this movie
        </Button>
      </RateBox>
    );
  }
}

export default MovieRating;
