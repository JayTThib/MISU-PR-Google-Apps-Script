function getNextKey(key)//this function isn't my code - https://stackoverflow.com/a/31540111
{
  if (key === 'Z' || key === 'z') 
  {
    return String.fromCharCode(key.charCodeAt() - 25) + String.fromCharCode(key.charCodeAt() - 25); // AA or aa
  } 
  else 
  {
    let lastChar = key.slice(-1);
    let sub = key.slice(0, -1);
    if (lastChar === 'Z' || lastChar === 'z') 
    {
      // If a string of length > 1 ends in Z/z,
      // increment the string (excluding the last Z/z) recursively,
      // and append A/a (depending on casing) to it
      return getNextKey(sub) + String.fromCharCode(lastChar.charCodeAt() - 25);
    } 
    else 
    {//(take till last char) append with (increment last char)
      return sub + String.fromCharCode(lastChar.charCodeAt() + 1);
    }
  }
}

function letterToColumn(letter)
{
  let column = 0, length = letter.length;

  for (let i = 0; i < length; i++)
  {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }

  return column;
}

function columnToLetter(column)
{
  let temp, letter = '';

  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }

  return letter;
}