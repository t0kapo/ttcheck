# ttcheck   

This Action checks for "Trusted Types" and "policy" for Trusted Types in the HTML and transforms HTML code as necessary.  

## Usage  

In this example workflow, the action checks the `Trusted Types` and `policy` in  `template/index.html (relative path)`  and transform the code as necessary. The "js-policy-file-path(here is "policy.js")" is explained later.
```yaml
steps: 
    - uses: actions/checkout@v2    
    - name: Check policy in HTML    
      id: tt    
      uses: t0kapo/ttcheck@v1.1    
      with:
        html-file-path: template/index.html     
        js-policy-file-path: policy.js    
    - name: Output run time    
      run: echo "This program took ${{ steps.tt.outputs.time }} seconds to run!"   
    - uses: stefanzweifel/git-auto-commit-action@v4.12.0   
```    
## Inputs

## `html-file-path`    
"html-file-path" specifies a path to the file checking Trusted Types and policy are effective (seeing meta tag).     
ex:  `index.html`,  `template/index.html`      
    
      
1.If "Trusted Types" is not enabled   
    Insert the meta tag that enables Trusted Types(ex.  <meta http-equiv="Content-Security-Policy" content="require-trusted-types-for 'script';  trusted-types *** ">).   
2.If "Trusted Types" is enabled   
    Nothing to do.   
   
  
## `js-policy-file-path`     
"js-policy-file-path" specifies a path to the file that you want to insert policy for Trusted Types.    
example: `policy.js`, `static/js/policy.js`    
     
     
1.If the policy is not in place    
    Insert the policy name to the meta tag (ex(policy name is "mypolivy"). <meta http-equiv="Content-Security-Policy" content="require-trusted-types for 'script';  trusted-types mypolicy">).  
2.If the policy is already in place     
    Nothing to do.

## Outputs   

## `time`    
`time` gets run time of this program.    

