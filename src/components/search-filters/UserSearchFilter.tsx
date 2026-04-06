import '../../styles/user/UserSearchFilter.css'

type Props = {
    searchName: string
    searchEmail: string
    onNameChange: (value: string) => void
    onEmailChange: (value: string) => void
}

export function UserSearchFilter({ searchName, searchEmail, onNameChange, onEmailChange }: Props) {
    return (
        <div className="filters">
            <label>
                Search name
                <input
                    value={searchName}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Nhập tên..."
                />
            </label>
            <label>
                Search email
                <input
                    value={searchEmail}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="Nhập email..."
                />
            </label>
        </div>
    )
}