
/*
 * We can export without default but then we have to use the same name when
 * we import as we do when we export. Check 'main.js' to see difference
 */
export const hoho = ()=>{
  console.log('hoho');
}

/*
 * We can either export it directly here or we can export it like 'hoho'
 */
const sayHey = () => { 
  console.log('Hello!')

};


/**
 * We say that we want to export the function from this file.
 * We use default to specify that this is the function that we
 * import 
 */
export default sayHey;