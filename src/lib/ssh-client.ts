import { Client } from 'ssh2'

export interface VPSConfig {
  host: string
  port: number
  username: string
  password: string
}

export interface SSHResult {
  success: boolean
  output: string
  error?: string
}

export async function executeCommand(config: VPSConfig, command: string): Promise<SSHResult> {
  return new Promise((resolve) => {
    const conn = new Client()
    let output = ''
    let errorOutput = ''

    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          conn.end()
          resolve({ success: false, output: '', error: err.message })
          return
        }
        stream.on('close', (code: number) => {
          conn.end()
          resolve({ success: code === 0, output, error: errorOutput || undefined })
        }).on('data', (data: Buffer) => {
          output += data.toString()
        }).stderr.on('data', (data: Buffer) => {
          errorOutput += data.toString()
        })
      })
    }).on('error', (err: Error) => {
      resolve({ success: false, output: '', error: err.message })
    }).connect({
      host: config.host,
      port: config.port || 22,
      username: config.username,
      password: config.password,
      readyTimeout: 20000,
      keepaliveInterval: 0
    })
  })
}

export async function executeBackground(config: VPSConfig, command: string, logFile: string): Promise<SSHResult> {
  // Run with nohup so it continues after disconnect
  const bgCommand = `nohup bash -c '${command.replace(/'/g, "'\''")}' > ${logFile} 2>&1 & echo "PID:$!"`
  return executeCommand(config, bgCommand)
}

export async function readFile(config: VPSConfig, remotePath: string): Promise<string> {
  return new Promise((resolve) => {
    const conn = new Client()
    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
        if (err) { conn.end(); resolve(''); return }
        const chunks: Buffer[] = []
        const stream = sftp.createReadStream(remotePath)
        stream.on('data', (chunk: Buffer) => chunks.push(chunk))
        stream.on('close', () => { conn.end(); resolve(Buffer.concat(chunks).toString()) })
        stream.on('error', () => { conn.end(); resolve('') })
      })
    }).on('error', () => resolve('')).connect({
      host: config.host, port: config.port || 22, username: config.username, password: config.password, readyTimeout: 20000
    })
  })
}

export async function checkProcess(config: VPSConfig, pid: string): Promise<boolean> {
  const result = await executeCommand(config, `ps -p ${pid} > /dev/null 2>&1 && echo "RUNNING" || echo "STOPPED"`)
  return result.output.includes('RUNNING')
}

export async function testConnection(config: VPSConfig): Promise<{ success: boolean; message: string }> {
  const result = await executeCommand(config, 'echo "KYRIEL_SSH_OK" && uname -a')
  if (result.success && result.output.includes('KYRIEL_SSH_OK')) {
    return { success: true, message: 'SSH connection established. OS: ' + result.output.replace('KYRIEL_SSH_OK\n','').split('\n')[0] }
  }
  return { success: false, message: result.error || 'Connection failed' }
}
