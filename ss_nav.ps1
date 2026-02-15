Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class W32 {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@

function Screenshot($filename) {
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bitmap.Save("C:\workspaces\credit-loan-system\$filename")
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Output "Saved $filename"
}

# Kill all browsers completely
Get-Process msedge -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 5

# Start Edge with inprivate and the URL - using cmd to ensure proper argument passing
Start-Process "cmd" "/c start msedge --inprivate http://localhost:3001" -WindowStyle Hidden
Start-Sleep -Seconds 10

# Find and focus Edge
$edge = Get-Process msedge -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero } | Select-Object -First 1
if ($edge) {
    [W32]::ShowWindow($edge.MainWindowHandle, 3) | Out-Null
    [W32]::SetForegroundWindow($edge.MainWindowHandle) | Out-Null
    Write-Output "Edge focused"
}
Start-Sleep -Seconds 2

Screenshot "final_dashboard.png"

# Navigate to contracts/1
$wshell = New-Object -ComObject wscript.shell
$wshell.AppActivate('InPrivate')
Start-Sleep -Milliseconds 500
$wshell.SendKeys('%d')
Start-Sleep -Milliseconds 500
$wshell.SendKeys('http://localhost:3001/loans/contracts/1{ENTER}')
Start-Sleep -Seconds 6

Screenshot "final_detail.png"

Write-Output "All done"
