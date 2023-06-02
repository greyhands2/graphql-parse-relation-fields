const objectFactory=({arr, dbRelationalFields, type})=>{
    let res = {[type]:{}};
    for(let index=0; index < arr.length; index++){
        
        let selection = arr[index]
        
        if(selection.kind === "FragmentSpread" || selection["name"]["value"] === '__typename') continue;
        let currentField = selection["name"]["value"];
        
        if(!!dbRelationalFields.includes(currentField)===false){
            res[type][currentField] = true;
        } else {
            res[type][currentField] = {...objectFactory({arr:selection.selectionSet.selections, dbRelationalFields, type})};
        }
    }

       
    return res;
    
}


const gprf = ({info, dbRelationalFields, type}) => {
    let result = {}
    let fragArray = Object.keys(info.fragments)
    if(fragArray.length > 0){
     
        fragArray.forEach((fragment)=>{
            let res = objectFactory({arr: info.fragments[fragment].selectionSet.selections, dbRelationalFields, type});
            result = preventResultOverwrite(result, type, res)
           
        })
    } 
    
    
    let res = objectFactory({arr: info.fieldNodes[0].selectionSet.selections, dbRelationalFields, type})
    result = preventResultOverwrite(result, type, res)
    
    return result
}


const preventResultOverwrite = (result, type, res) => {
    if(result[type]){
        result[type] = {...result[type], ...res[type]}
    } else {
        result = {...result,...res}
    }
    return result
}
module.exports = gprf;


