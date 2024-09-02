function alignAffineFitting(str1, str2, matchReward=10, mismatchPenalty=-5, indelBeginPenalty=-15, indelContinuePenalty=-4) {
  const m = str1.length;
  const n = str2.length;

  // Initialize the dpNormal and dpIndel matrices
  const dpNormal = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));
  const dpIndel = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));

  // Fill the first row and column
  dpNormal[0][0] = 0;
  for (let i = 1; i <= m; i++) {
    dpIndel[i][0]  = indelBeginPenalty + (i-1)*indelContinuePenalty;
    dpNormal[i][0] = dpIndel[i][0];
  }
  for (let j = 1; j <= n; j++) {
    dpIndel[0][j]  = indelBeginPenalty;
    dpNormal[0][j] = 0;
  }

  // Fill the dpNormal and dpIndel matrices
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // dpIndel first
      const cont = Math.max(dpIndel[i-1][j], dpIndel[i][j-1])+indelContinuePenalty;
      const start = Math.max(dpNormal[i-1][j], dpNormal[i][j-1])+indelBeginPenalty;
      dpIndel[i][j] = Math.max(cont,start);
      // dpNormal next
      dpNormal[i][j] = Math.max(dpNormal[i-1][j-1] + (str1[i-1]==str2[j-1]?matchReward:mismatchPenalty), dpIndel[i][j]);
    }
  }
  const best = Math.max(...dpNormal[m])

  // Perform backtracking
  let out1 = [];
  let out2 = [];
  let i = m;
  let j = dpNormal[m].indexOf(best);

  let isNormalMode = true;
  let currentScore = dpNormal[m][n];

  // Backtracking helper
  const findSourceFromIndel = (currentScore,i,j,dpIndel,dpNormal)=>(
    // (currentScore== dpIndel[i-1][j-1]+indelContinuePenalty*2)?[ true,  true, false]:
    (currentScore== dpIndel[i+0][j-1]+indelContinuePenalty)?  [false,  true, false]:
    (currentScore== dpIndel[i-1][j+0]+indelContinuePenalty)?  [ true, false, false]:
    (currentScore==dpNormal[i+0][j-1]+indelBeginPenalty)?     [false,  true,  true]:
    (currentScore==dpNormal[i-1][j+0]+indelBeginPenalty)?     [ true, false,  true]:"failed"
  );

  while (i>0 && j>0) {
    if (isNormalMode)
    {
      if (dpNormal[i][j]==currentScore)
        isNormalMode = false;
      else {
        out1.push(str1[--i]);
        out2.push(str2[--j]);
        currentScore = dpNormal[i][j];
      }
    }
    if (!isNormalMode) {
      const [left, right, fromNorm] = findSourceFromIndel(currentScore,i,j,dpIndel,dpNormal);
      out1.push( left?str1[--i]:"-");
      out2.push(right?str2[--j]:"-");
      currentScore = (fromNorm?dpNormal:dpIndel)[i][j];
      isNormalMode = fromNorm;
    }
  }

  out1.push(str1.substring(0,i));
  out2.push('-'.repeat(i));

  out1 = out1.reverse().join("");
  out2 = out2.reverse().join("")

  return [out1, out2, best/10];
}

function alignMany(master, seqs) {
  key = master;
  seqs.forEach(seq=>key=alignAffineFitting(key,seq)[0]);
  return [key, seqs.map(seq=> alignAffineFitting(key,seq)[1])];
}