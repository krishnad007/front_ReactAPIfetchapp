// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './App.css'; // Import CSS file

function App() {
  const [planets, setPlanets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; // Number of items to display per page

  useEffect(() => {
    axios.get('https://swapi.dev/api/planets/?format=json')
      .then(response => setPlanets(response.data.results))
      .catch(error => console.error(error));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPlanets = planets.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const hasNextPage = () => {
    const totalPages = Math.ceil(planets.length / itemsPerPage);
    return currentPage < totalPages;
  };

  const hasPrevPage = () => currentPage > 1;

  return (
    < >
     <div className="header">
      <Container className='container'>
        <Row className='content'>
          {currentPlanets.map(planet => (
            <Col key={planet.name} xs={12} md={6} lg={4}>
              <PlanetCard planet={planet} />
            </Col>
          ))}
        </Row>
      </Container>
      <div className="pagination">
        <div className='child'>
          <button onClick={prevPage} disabled={!hasPrevPage()}>Previous</button>
        </div>
        <div className='child'>
        <button onClick={nextPage} disabled={!hasNextPage()}>Next</button>
        </div>
      </div>
      </div>
    </>
  );
}

function PlanetCard({ planet }) {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    Promise.all(planet.residents.map(residentUrl => axios.get(residentUrl)))
      .then(responses => setResidents(responses.map(response => response.data)))
      .catch(error => console.error(error));
  }, [planet.residents]);

  return (
    <Card className="planet-card" data-planet={planet.name}>
      <Card.Body>
        <Card.Title>{planet.name}</Card.Title>
        <Card.Text>
          Climate: {planet.climate}<br />
          Population: {planet.population}<br />
          Terrain: {planet.terrain}
        </Card.Text>
        <ResidentList residents={residents} />
      </Card.Body>
    </Card>
  );
}

function ResidentList({ residents }) {
  return (
    <>
      <Card.Title>Residents:</Card.Title>
      <ul>
        {residents.map(resident => (
          <li key={resident.name}>
            Name: {resident.name}<br />
            Height: {resident.height}<br />
            Mass: {resident.mass}<br />
            Gender: {resident.gender}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
