import NavBar from "../components/NavBar";
import RedirectButton from "../components/RedirectButton";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Bienvenido a la App</h1>
        <p className="mb-4">Aquí puedes gestionar los materiales.</p>
        <RedirectButton text="Nueva cotizacion" to="/nuevaCotizacion" />
      </div>
    </>
  );
}
