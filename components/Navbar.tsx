import Link from "next/link"

export default function Navbar() {
	return (
		<header className="flex justify-between p-2 mb-4">
			{/* <span>好好Sound</span> */}
			<Link href="/">好好Sound</Link>
			<nav className="flex gap-4 justify-end">
				<Link href="/library">所有的</Link>
				<Link href="/lists">您的</Link>
			</nav>
		</header>
	)
}