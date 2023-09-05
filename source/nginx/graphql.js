async function response(r) {
    const options = {
        args: r.variables.args,
        detached: false,
        method: r.method
    };
    
    const path = r.uri.includes('v1') ? '/_v1' : '/_v2';
    
    r.subrequest(`${path}${r.uri}`, options, function(res) {
        const code = r.headersIn['X-Hasura-Request'] ? 200 : res.status;
        r.headersOut['Content-Type'] = 'application/json';
        r.return(code, res.responseBuffer);
    });
};

export default { response };