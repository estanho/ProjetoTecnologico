export default function LogoutButton() {
  return (
    <form action="/api/auth/sign-out" method="post">
      <button type="submit" className="w-full text-left" aria-label="Sair">
        Sair
      </button>
    </form>
  );
}
