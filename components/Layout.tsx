export default function Layout({ children }) {
	return (
		<main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800  ">
			<div className="sm:max-w-[600px] text-white mx-auto">
				{children}
			</div>
		</main>
	)
}