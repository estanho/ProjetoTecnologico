import Map from '../../components/Map';

export default function NewRoutePage() {
  return (
    <div className="flex flex-row h-full">
      <div>
        <h1>Teste</h1>
        <form className="flex flex-col">
          <input name="source_place" placeholder="origem" />
          <input name="destination_place" placeholder="destino" />
          <button type="submit">Pesquisar</button>
        </form>
      </div>
      <div className="h-full w-full">
        <Map />
      </div>
    </div>
  );
}
