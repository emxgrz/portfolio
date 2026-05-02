import Countdown from '../components/Countdown';

const Home = () => {
  return (
    <>
      <section className="hero hero-home home-hero">
        <div className="home-composition">
          <img
            className="home-asset home-asset-2"
            src="https://www.figma.com/api/mcp/asset/ced808dc-43d1-4040-91a3-0a1191707dd9"
            alt="Decoración sábado"
          />
          <div className="home-asset-overlay">
            <img
              className="home-asset home-asset-1"
              src="https://www.figma.com/api/mcp/asset/f252167e-2f9a-4f90-afc5-c8d065f89144"
              alt="Decorativo viernes"
            />
          </div>
        </div>
      </section>

      <Countdown />
    </>
  );
};

export default Home;
