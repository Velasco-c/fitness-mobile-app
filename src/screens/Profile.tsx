import { Icon } from '../components/Icons';
import { RegisterForm } from '../components/RegisterForm';
import { useApp } from '../context/AppContext';
import { GOALS } from '../data/goals';

/** Sin usuario muestra el registro; con usuario muestra su ficha. */
export function Profile() {
  const { user, setUser } = useApp();

  if (!user) {
    return (
      <div className="screen-scroll">
        <header className="screen-head"><h1>Profile</h1></header>
        <RegisterForm />
      </div>
    );
  }

  const goal = GOALS.find(g => g.id === user.goal)?.label ?? user.goal;
  return (
    <div className="screen-scroll">
      <header className="screen-head"><h1>Profile</h1></header>
      <section className="card profile-card">
        <span className="avatar big"><Icon name="profile" size={34} /></span>
        <h3>{user.name}</h3>
        <p className="muted">{user.email}</p>
        <p className="goal">Goal: {goal}</p>
      </section>
      <button className="btn-ghost" onClick={() => setUser(null)}>Sign out</button>
    </div>
  );
}
