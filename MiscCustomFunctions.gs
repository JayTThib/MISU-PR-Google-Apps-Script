/**
 * @customfunction
 */
function MINREQ(input)
{
  let minimumAttendanceCount = 6;

  if (input > minimumAttendanceCount)
  {
    return 0;
  }
  else
  {
    return minimumAttendanceCount - input;
  }
}

