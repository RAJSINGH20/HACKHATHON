import { Link } from 'react-router-dom'

const registrationOptions = [
	{
		path: '/admin-register',
		label: 'Admin Register',
		eyebrow: 'Operations access',
		description: 'Create an administrator account to manage Farmer AI operations and users.',
		badge: 'AD',
		accent: 'border-emerald-200 bg-emerald-50 text-emerald-800',
		button: 'bg-emerald-700 hover:bg-emerald-800',
	},
	{
		path: '/govt-register',
		label: 'Govt Register',
		eyebrow: 'Government access',
		description: 'Register an official government account for programmes, districts, and field work.',
		badge: 'GV',
		accent: 'border-sky-200 bg-sky-50 text-sky-800',
		button: 'bg-sky-700 hover:bg-sky-800',
	},
]

function Dashboard() {
	return (
		<main className="min-h-screen overflow-hidden bg-[#f4f8f1] text-slate-900">
			<div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12 sm:px-10">
				<div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

				<section className="relative w-full">
					<div className="mb-12 max-w-2xl">
						<p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-emerald-700">
							Farmer AI administration
						</p>
						<h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
							Choose your registration
						</h1>
						<p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
							Select the account type you need to continue to the correct registration form.
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{registrationOptions.map((option) => (
							<Link
								key={option.path}
								to={option.path}
								className="group rounded-3xl border border-white/80 bg-white/90 p-7 shadow-lg shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200"
							>
								<div className="flex items-start justify-between gap-4">
									<div className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-lg font-bold ${option.accent}`}>
										{option.badge}
									</div>
									<span className="text-2xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500">
										-&gt;
									</span>
								</div>
								<p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
									{option.eyebrow}
								</p>
								<h2 className="mt-2 text-2xl font-bold text-slate-900">{option.label}</h2>
								<p className="mt-3 min-h-14 leading-7 text-slate-600">{option.description}</p>
								<span className={`mt-7 inline-flex rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${option.button}`}>
									Continue to registration
								</span>
							</Link>
						))}
					</div>
				</section>
			</div>
		</main>
	)
}

export default Dashboard
