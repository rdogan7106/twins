const LoginForm = ({ handleLoginClick, handleRegisterClick, username, setUsername, password, setPassword, error }) => {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg " style={{ width: '40%' }}>
                <div className="card-body m-5">
                    <form onSubmit={handleLoginClick}>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-outline mb-4">
                            <input 
                                type="text" 
                                id="username" 
                                className="form-control"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                            <label className="form-label" htmlFor="username">Username</label>
                        </div>

                        <div className="form-outline mb-4">
                            <input 
                                type="password" 
                                id="password" 
                                className="form-control"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <label className="form-label" htmlFor="password">Password</label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block mb-4 w-100">Sign in</button>

                        <div className="text-center mt-3">
                            <p>Not a member? <a href="#!" onClick={handleRegisterClick}>Register</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;